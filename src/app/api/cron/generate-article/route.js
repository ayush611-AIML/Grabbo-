import { NextResponse } from 'next/server';
import { generateArticle } from '../../../../../backend/ai.js';
import prisma from '../../../../../backend/db.js';

export async function GET(req) {
  // Verify cron secret for security
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { title, content } = await generateArticle();
    
    const article = await prisma.article.create({
      data: {
        title,
        content
      }
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
