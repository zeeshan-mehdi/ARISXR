import OpenAI from "openai";

// Lazy initialization to avoid errors on module load
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    
    if (!apiKey || !endpoint || !deployment) {
      throw new Error(
        'Azure OpenAI configuration is missing. Please set AZURE_OPENAI_API_KEY, ' +
        'AZURE_OPENAI_ENDPOINT, and AZURE_OPENAI_DEPLOYMENT environment variables.'
      );
    }
    
    // Using Azure OpenAI
    openaiClient = new OpenAI({
      apiKey: apiKey,
      baseURL: `${endpoint}openai/deployments/${deployment}`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: { "api-key": apiKey },
    });
  }
  
  return openaiClient;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "o4-mini-2025-04-16",
      messages: messages,
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content || "I couldn't generate a response.";
  } catch (error: any) {
    console.error("Azure OpenAI error:", error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

export async function answerProcessQuestion(
  processContext: string,
  question: string
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `You are an ARIS Process Intelligence AI assistant helping users understand BPMN business processes. You have access to the current process visualization and can answer questions about process flows, elements, and business logic. Be concise but informative. If asked about specific elements, explain their purpose and connections.`
    },
    {
      role: "user",
      content: `Process Context:\n${processContext}\n\nQuestion: ${question}`
    }
  ];

  return await chatWithAI(messages);
}
