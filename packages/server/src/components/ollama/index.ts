// ollamaClient.ts
import ollama from 'ollama'

/**
 * Fetches a chat response from the Ollama service using the specified model
 * and user message.
 *
 * @param model - The Ollama model to be used for generating the response.
 * @param userMessage - The message to be sent to the model.
 * @returns The content of the model's response as a string.
 * @throws Will throw an error if the request fails.
 */
export async function chatWithModel(
    model: string,
    userMessage: string
): Promise<string> {
    try {
        const response = await ollama.chat({
            model,
            messages: [{ role: 'user', content: userMessage }],
        })

        return response.message.content
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to fetch chat response: ${errorMessage}`)
    }
}
