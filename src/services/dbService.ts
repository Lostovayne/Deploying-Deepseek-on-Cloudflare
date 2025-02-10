export const saveChatToD1 = async (env: any, question: string, response: string) => {
  const result = await env.DB.prepare(
    "INSERT INTO chat_history (question, response, created_at) VALUES (?, ?, ?)"
  )
    .bind(question, response, Date.now())
    .run();

  return result.lastInsertRowId; // Retorna el ID generado
};

export const getChatResponseFromD1 = async (env: any, d1_id: string) => {
  return await env.DB.prepare("SELECT response FROM chat_history WHERE id = ?")
    .bind(d1_id)
    .first("response");
};
