import { NextRequest, NextResponse } from 'next/server';

const CUSTOM_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const CUSTOM_HEADERS = {
  'customerId': 'cus_Sxr3rlGaox3rKZ',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

interface LLMRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, systemPrompt, model, temperature = 0.7, maxTokens = 4096, provider = 'openrouter' } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const messages: LLMRequest['messages'] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    let selectedModel = model;
    if (!selectedModel) {
      switch (provider) {
        case 'openai':
          selectedModel = 'openrouter/openai/gpt-4o';
          break;
        case 'anthropic':
          selectedModel = 'openrouter/anthropic/claude-sonnet-4';
          break;
        case 'google':
          selectedModel = 'openrouter/google/gemini-pro';
          break;
        case 'blackbox':
          selectedModel = 'openrouter/meta-llama/llama-3.1-8b-instruct';
          break;
        default:
          selectedModel = 'openrouter/anthropic/claude-sonnet-4';
      }
    }

    const requestPayload: LLMRequest = {
      model: selectedModel,
      messages,
      temperature,
      max_tokens: maxTokens
    };

    const startTime = Date.now();

    const response = await fetch(CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: CUSTOM_HEADERS,
      body: JSON.stringify(requestPayload)
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: `LLM request failed: ${response.status} ${response.statusText}`,
        details: errorData
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json({
        success: false,
        error: 'Invalid response format from LLM provider'
      }, { status: 500 });
    }

    const choice = data.choices[0];
    const usage = data.usage || {};

    return NextResponse.json({
      success: true,
      data: {
        content: choice.message.content,
        model: selectedModel,
        provider: provider,
        responseTime,
        tokens: usage.total_tokens || 0,
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        finishReason: choice.finish_reason,
        metadata: {
          temperature,
          maxTokens,
          systemPrompt: !!systemPrompt
        }
      }
    });

  } catch (error: any) {
    console.error('LLM API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: `LLM request failed: ${error.message}`,
      details: {
        type: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'openrouter';
    const testModel = searchParams.get('model') || 'openrouter/anthropic/claude-sonnet-4';

    const testPayload = {
      model: testModel,
      messages: [{ role: 'user' as const, content: 'Hello, please respond with "Connection successful"' }],
      max_tokens: 20
    };

    const startTime = Date.now();
    
    const response = await fetch(CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: CUSTOM_HEADERS,
      body: JSON.stringify(testPayload)
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        provider,
        model: testModel,
        error: `Connection test failed: ${response.status}`,
        responseTime
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      provider,
      model: testModel,
      responseTime,
      testResponse: data.choices?.[0]?.message?.content || 'No response content',
      usage: data.usage
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Connection test failed: ${error.message}`
    }, { status: 500 });
  }
}