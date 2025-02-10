export const generateEmbedding = async (text: string): Promise<number[]> => {
  // Simulación de generación de embedding, reemplaza con tu API real
  return text.split(" ").map(word => word.length * 0.1);
};
