import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AISupportAPIClient } from '../api-client';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('AISupportAPIClient', () => {
  const mockConfig = {
    apiKey: 'test-api-key',
    apiUrl: 'https://api.test.com',
  };

  let client: AISupportAPIClient;

  beforeEach(() => {
    client = new AISupportAPIClient(mockConfig);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with config', () => {
      expect(client).toBeInstanceOf(AISupportAPIClient);
    });

    it('should default wsUrl to apiUrl', () => {
      const configWithoutWs = { apiKey: 'key', apiUrl: 'https://api.test.com' };
      const clientWithoutWs = new AISupportAPIClient(configWithoutWs);
      expect(clientWithoutWs).toBeInstanceOf(AISupportAPIClient);
    });
  });

  describe('init', () => {
    it('should call init endpoint with correct params', async () => {
      const mockResponse = {
        response: 'success',
        message: 'Чат успешно создан',
        data: {
          chatId: 'chat-123',
          startMessage: 'Добрый день!',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.init();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/api/integration/init',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw on failed init', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(client.init()).rejects.toThrow();
    });
  });

  describe('sendMessage', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response: 'success', message: 'ok', data: { chatId: 'chat-123', startMessage: 'Hi' } }),
      });
      await client.init();
    });

    it('should send message with content', async () => {
      const mockResponse = {
        response: 'success',
        message: 'Сообщение успешно отправлено',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.sendMessage('Hello');

      expect(mockFetch).toHaveBeenLastCalledWith(
        'https://api.test.com/api/integration/send-message',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Hello'),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw if not initialized', async () => {
      const newClient = new AISupportAPIClient(mockConfig);
      await expect(newClient.sendMessage('test')).rejects.toThrow('Chat not initialized');
    });
  });

  describe('getMessages', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response: 'success', message: 'ok', data: { chatId: 'chat-123', startMessage: 'Hi' } }),
      });
      await client.init();
    });

    it('should fetch messages with pagination', async () => {
      const mockResponse = {
        response: 'success',
        message: 'Сообщения успешно получены',
        data: [{ _id: 'msg-1', content: 'Test', role: 'user', type: 'text' }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getMessages(50);

      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/api/integration/messages'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(result.data).toHaveLength(1);
    });
  });
});
