// ollamaClient.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chatWithModel } from './index.js';

// Mock the ollama import
vi.mock('ollama', () => {
  return {
    __esModule: true,
    default: {
      // We'll mock the `chat` method to control the behavior in our tests
      chat: vi.fn(),
    },
  };
});

// Re-import the (now mocked) ollama module
import ollama from 'ollama';

describe('chatWithModel', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it('should return the correct message content on success', async () => {
    // Arrange
    (ollama.chat as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      message: { content: 'Mocked Content' },
    });

    // Act
    const result = await chatWithModel('mock-model', 'Hello, model');

    // Assert
    expect(result).toBe('Mocked Content');
    expect(ollama.chat).toHaveBeenCalledTimes(1);
    expect(ollama.chat).toHaveBeenCalledWith({
      model: 'mock-model',
      messages: [{ role: 'user', content: 'Hello, model' }],
    });
  });

  it('should throw an error if the chat method fails', async () => {
    // Arrange
    (ollama.chat as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Chat failed')
    );

    // Act & Assert
    await expect(
      chatWithModel('failing-model', 'Hello, model')
    ).rejects.toThrow('Failed to fetch chat response: Chat failed');
    expect(ollama.chat).toHaveBeenCalledTimes(1);
  });
});
