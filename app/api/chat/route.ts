import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const HARDCODED_QUESTIONS: Record<string, string> = {
  'what are your services': 'We offer software development, consulting, and support.',
  'what are your business hours': 'Our business hours are Monday to Friday, 9 AM to 5 PM.',
  'where are you located': 'We are based in San Francisco, CA.',
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, message } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Missing phone number' }, { status: 400 });
    }

    // Step 1: If only phone is provided
    if (!message) {
      const user = await prisma.user.findUnique({ where: { phone } });
      if (user) {
        return NextResponse.json({ found: true, name: user.name });
      } else {
        return NextResponse.json({ found: false });
      }
    }

    // Step 2: If phone and message are provided
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      // Expect message to be the user's name in this case
      const newUser = await prisma.user.create({ data: { phone, name: message } });
      return NextResponse.json({ reply: `Welcome, ${newUser.name}! Ask me anything.` });
    }

    const lower = message.toLowerCase().trim();
    const hardcodedReply = HARDCODED_QUESTIONS[lower];

    if (hardcodedReply) {
      return NextResponse.json({ reply: hardcodedReply });
    } else {
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system', content: 'You are a text-based customer support assistant for Cayu.ai, a company that builds GenAI-powered voice agents for supply chain businesses. You answer only questions about Cayu.ai’s products, technology, use cases, and services. Politely decline to answer questions not related to Cayu.ai.',
          },
          { role: 'user', content: message },
        ],
      });

      const answer = gptResponse.choices[0]?.message?.content || 'Sorry, I could not understand that.';
      return NextResponse.json({ reply: answer });
    }
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
