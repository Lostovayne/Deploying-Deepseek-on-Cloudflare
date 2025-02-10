import { smoothStream, streamText } from "ai";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { createWorkersAI } from "workers-ai-provider";

interface EmbeddingResponse {
  shape: number[];
  data: number[][];
}

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", cors());

app.post("/generate", async (c) => {
  let prompt = await c.req.text();
  {
    const workersai = createWorkersAI({ binding: c.env.AI });
    try {
      const result = streamText({
        model: workersai(c.env.AI_MODEL),
        system:
          "Eres un Agente que ayuda en la codificacion de codigo de alta calidad. Tus respuestas deben ser lo mas breves posibles y claras que puedas. Trata de no pasar los 200 o 300 caracteres",
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
  const response = await c.env.AI.run(c.env.EMBEDDING_MODEL, {
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

async function searchQuery(c: Context, query: string) {
  const queryVector: EmbeddingResponse = await c.env.AI.run(
    c.env.EMBEDDING_MODEL,
    {
      text: [query],
    }
  );
  let matches = await c.env.VECTORIZE.query(queryVector.data[0], {
    topK: 1,
  });
  return c.json(matches, { status: 200 });
}

export default app;
