import { smoothStream, streamText } from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createWorkersAI } from "workers-ai-provider";

interface EmbeddingResponse {
  shape: number[];
  data: number[][];
}

interface Envs extends CloudflareBindings {
  AI: Ai;
}

const app = new Hono<{ Bindings: Envs }>();

app.use("*", cors());

app.post("/generate", async (c) => {
  let prompt = await c.req.text();
  {
    const workersai = createWorkersAI({ binding: c.env.AI });
    try {
      const result = streamText({
        model: workersai(c.env.AI_MODEL),
        system:
          "Responde de manera clara y concisa y siempre en español. \n Una vez lista tu respuesta, preguntate a ti mismo , ¿Es correcta esta respuesta? , en caso de no serlo mejora correctamente la misma, si esta correcta y validada solo la devuelves.",
        prompt: prompt,
        experimental_transform: smoothStream(),
      });

      return result.toTextStreamResponse({
        headers: {
          "Content-Type": "text/x-unknown",
          "content-encoding": "identity",
          "transfer-encoding": "chunked",
        },
      });
    } catch (error) {
      return new Response("The server is getting up ", { status: 400 });
    }
  }
});

app.post("/insert", async (c) => {
  // Agregar solicitudes a la base de datos o Api correspondiente para generar contexto nuevo
  let dataRequest = await c.req.text();
  const response = await c.env.AI.run("@cf/baai/bge-large-en-v1.5", {
    text: dataRequest,
  });

  let vectors: VectorizeVector[] = [];
  let id = 1;

  response.data.forEach((vector) => {
    vectors.push({ id: `${id}`, values: vector });
    id++;
  });

  let inserted = await c.env.VECTORIZE.upsert(vectors);
  return c.json({ inserted }, { status: 200 });
});

export default app;
