import { authService, API_BASE_URL } from '@/lib/auth';

export interface ChatResponse {
  sessionId: string;
  reply: string;
}

export const chatService = {
  async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    console.log('🤖 [CHAT SERVICE] Sending message to AI...', {
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      messageLength: message.length,
      sessionId: sessionId || 'default'
    });
    
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    console.log('🤖 [CHAT SERVICE] AI API response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('🤖 [CHAT SERVICE] ❌ Chat request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: text
      });
      throw new Error(text || `Chat request failed with status ${response.status}`);
    }

    const payload = await response.json();
    console.log('🤖 [CHAT SERVICE] Response payload:', payload);
    
    if (payload.error) {
      console.error('🤖 [CHAT SERVICE] ❌ AI service error:', payload);
      throw new Error(payload.message || 'AI chat service is not available');
    }

    if (!payload?.reply) {
      console.error('🤖 [CHAT SERVICE] ❌ Empty response from AI:', payload);
      throw new Error('Chat service returned an empty response.');
    }

    const result = {
      sessionId: sessionId || 'default',
      reply: payload.reply
    };
    
    console.log('🤖 [CHAT SERVICE] ✅ Message processed successfully:', {
      sessionId: result.sessionId,
      replyLength: result.reply.length,
      replyPreview: result.reply.substring(0, 100) + (result.reply.length > 100 ? '...' : '')
    });

    return result;
  },
};
