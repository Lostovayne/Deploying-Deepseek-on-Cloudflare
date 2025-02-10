import { GoogleGenerativeAI } from "@google/generative-ai";
import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { getChatResponseFromD1, saveChatToD1 } from "./services/dbService";
import { generateEmbedding } from "./services/embeddingService";
import { saveEmbeddingToVectorize, searchInVectorize } from "./services/vectorizeService";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.post("/chat", async c => {
  const { question } = await c.req.json();
  const env = c.env;

  // Instance Redis and Gemini Ai
  const redis = new Redis({ url: "URL_DE_UPSTASH", token: "TOKEN" });
  const gemini = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API_KEY);

  // 🔍 1️⃣ Buscar en Redis (cache rápido)
  const cachedResponse = await redis.get(question);
  if (cachedResponse) {
    return c.json({ response: cachedResponse, fromCache: true });
  }

  // 🔍 2️⃣ Buscar en Vectorize (preguntas similares)
  const queryEmbedding = await generateEmbedding(question);
  const d1_id = await searchInVectorize(env, queryEmbedding);

  if (d1_id) {
    const response = await getChatResponseFromD1(env, d1_id);
    if (response) {
      await redis.set(question, response, { ex: 3600 }); // Guardar en cache por 1h
      return c.json({ response, fromCache: true });
    }
  }

  // 🧠 3️⃣ Generar respuesta con Gemini => TODO: Agregar el modelo de AI correspondiente
  const aiResponse = `Respuesta de AI: ${question}`;

  // 💾 4️⃣ Guardar en D1
  const recordId = await saveChatToD1(env, question, aiResponse);

  // 🟢 5️⃣ Guardar en Vectorize
  const embedding = await generateEmbedding(aiResponse);
  await saveEmbeddingToVectorize(env, recordId, question, embedding);

  // 🔥 6️⃣ Guardar en Redis para futuras consultas
  await redis.set(question, aiResponse, { ex: 3600 });
  return c.json({ response: aiResponse, fromCache: false });
});

export default app;
