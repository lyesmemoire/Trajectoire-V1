/**
 * AI Streaming Service
 * Provides streaming capabilities for AI responses to improve UX
 * Instead of waiting 20 seconds for the full response, stream tokens as they arrive
 */

import { OpenAI } from "openai"

export interface StreamingOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  onToken?: (token: string) => void
  onComplete?: (fullResponse: string) => void
  onError?: (error: Error) => void
}

export interface StreamingResult {
  fullResponse: string
  tokenCount: number
  duration: number
}

export class AIStreamingService {
  private openai: OpenAI

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }

  /**
   * Stream AI response
   * @param messages - Conversation messages
   * @param options - Streaming options
   * @returns Promise with full response and metadata
   */
  async streamResponse(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    options: StreamingOptions = {}
  ): Promise<StreamingResult> {
    const {
      model = "gpt-4",
      temperature = 0.7,
      maxTokens = 2000,
      onToken,
      onComplete,
      onError,
    } = options

    const startTime = Date.now()
    let fullResponse = ""
    let tokenCount = 0

    try {
      const stream = await this.openai.chat.completions.create({
        model,
        messages: messages as any,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      })

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || ""
        
        if (token) {
          fullResponse += token
          tokenCount++
          
          // Call token callback if provided
          if (onToken) {
            onToken(token)
          }
        }
      }

      const duration = Date.now() - startTime

      // Call complete callback if provided
      if (onComplete) {
        onComplete(fullResponse)
      }

      return {
        fullResponse,
        tokenCount,
        duration,
      }
    } catch (error) {
      if (onError) {
        onError(error as Error)
      }
      throw error
    }
  }

  /**
   * Stream response to a Node.js writable stream (for HTTP responses)
   * @param messages - Conversation messages
   * @param writableStream - Writable stream to send tokens to
   * @param options - Streaming options
   */
  async streamToWritable(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    writableStream: NodeJS.WritableStream,
    options: StreamingOptions = {}
  ): Promise<StreamingResult> {
    const result = await this.streamResponse(messages, {
      ...options,
      onToken: (token: string) => {
        writableStream.write(token)
        if (options.onToken) {
          options.onToken(token)
        }
      },
    })

    writableStream.end()
    return result
  }

  /**
   * Stream response to a Web Response (for Next.js API routes)
   * @param messages - Conversation messages
   * @param options - Streaming options
   * @returns Response object with streaming
   */
  async streamToWebResponse(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    options: StreamingOptions = {}
  ): Promise<Response> {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this; // Capture context

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await self.streamResponse(messages, {
            ...options,
            onToken: (token: string) => {
              controller.enqueue(encoder.encode(token))
            },
          })

          controller.close()
          
          if (options.onComplete) {
            options.onComplete(result.fullResponse)
          }
        } catch (error) {
          controller.error(error)
          if (options.onError) {
            options.onError(error as Error)
          }
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  }
}

/**
 * Helper function to create a streaming response for Next.js API routes
 */
export async function createStreamingResponse(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  apiKey: string,
  options?: StreamingOptions
): Promise<Response> {
  const service = new AIStreamingService(apiKey)
  return service.streamToWebResponse(messages, options)
}
