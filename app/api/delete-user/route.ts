import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()

  if (!phone) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
  }

  try {
    await prisma.user.delete({
      where: { phone },
    })
    return NextResponse.json({ success: true, message: `Deleted user with phone ${phone}` })
  } catch (err) {
    return NextResponse.json({ error: 'User not found or already deleted' }, { status: 404 })
  }
}