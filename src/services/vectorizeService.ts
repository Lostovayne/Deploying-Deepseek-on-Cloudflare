export const saveEmbeddingToVectorize = async (
  env: any,
  id: string,
  question: string,
  embedding: number[]
) => {
  await env.VECTORIZE_INDEX.upsert([
    {
      id: `vector_${id}`,
      values: embedding,
      metadata: { question, d1_id: id, timestamp: Date.now() },
    },
  ]);
};

export const searchInVectorize = async (env: any, queryEmbedding: number[]) => {
  const searchResults = await env.VECTORIZE_INDEX.query({
    queries: [{ values: queryEmbedding, topK: 5 }],
  });

  return searchResults[0]?.metadata?.d1_id; // Retorna el ID de D1 más relevante
};
