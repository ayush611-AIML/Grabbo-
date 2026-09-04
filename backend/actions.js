'use server';

import prisma from './db.js';

export async function getLatestArticles() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    // Serialize dates to strings for crossing the Server/Client boundary
    return articles.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString()
    }));
  } catch (e) {
    console.error("Failed to fetch articles:", e);
    return [];
  }
}
