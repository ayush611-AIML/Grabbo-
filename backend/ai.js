import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateArticle() {
  const prompt = `
You are the head of compliance and product curation for GRABBO, an ultra-luxury convenience store.
Write a short, elegant, editorial-style article (about 150-200 words) discussing either a new store regulation, a safety precaution, or a curation standard for your high-end products.
The tone must be sophisticated, reassuring, and premium. Format it using Markdown.
Include a catchy, sophisticated title as an H3 header (###).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });
    
    const text = response.text;
    
    // Extract title (assume first line starting with ###)
    const lines = text.split('\n');
    let title = 'Regulatory Update';
    const titleLineIndex = lines.findIndex(l => l.trim().startsWith('### '));
    if (titleLineIndex !== -1) {
      title = lines[titleLineIndex].replace('### ', '').trim();
      lines.splice(titleLineIndex, 1);
    }
    
    const content = lines.join('\n').trim();
    return { title, content };
  } catch (error) {
    console.error("Failed to generate article:", error);
    throw error;
  }
}
