import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { PromptService } from '@/lib/services/prompt.service';
import { updatePromptSchema } from '@/lib/schemas/prompt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prompt = await PromptService.getPrompt(params.id, user.id, true);
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const updatedPrompt = await PromptService.updatePrompt(params.id, body);
    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await PromptService.deletePrompt(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}