import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageInput } from '@/components/chat/MessageInput';
import { useChatStore } from '@/app/chat/store';

jest.mock('@/app/chat/store', () => ({
  useChatStore: jest.fn(() => ({
    sendMessage: jest.fn(),
    startTyping: jest.fn(),
    stopTyping: jest.fn(),
  })),
}));

describe('MessageInput', () => {
  const mockSendMessage = jest.fn();
  const mockStartTyping = jest.fn();
  const mockStopTyping = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useChatStore as jest.Mock).mockReturnValue({
      sendMessage: mockSendMessage,
      startTyping: mockStartTyping,
      stopTyping: mockStopTyping,
    });
  });

  it('renders textarea with placeholder', () => {
    render(<MessageInput conversationId="conv-1" />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<MessageInput conversationId="conv-1" />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('send button is enabled when input has content', () => {
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).not.toBeDisabled();
  });

  it('calls sendMessage when send button is clicked', () => {
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    expect(mockSendMessage).toHaveBeenCalledWith('conv-1', 'Hello World', expect.any(String));
  });

  it('clears input after sending message', () => {
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    expect(textarea).toHaveValue('');
  });

  it('sends message on Enter key press', () => {
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(mockSendMessage).toHaveBeenCalled();
  });

  it('adds newline on Shift+Enter', () => {
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'Line1\nLine2' } });
    expect(textarea).toHaveValue('Line1\nLine2');
  });

  it('does not send message on Shift+Enter', () => {
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('triggers typing on input change', () => {
    jest.useFakeTimers();
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'H' } });
    expect(mockStartTyping).toHaveBeenCalledWith('conv-1');
    jest.advanceTimersByTime(2000);
    expect(mockStopTyping).toHaveBeenCalledWith('conv-1');
    jest.useRealTimers();
  });

  it('stops typing after 2 seconds of inactivity', () => {
    jest.useFakeTimers();
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    jest.advanceTimersByTime(2000);
    expect(mockStopTyping).toHaveBeenCalledWith('conv-1');
    jest.useRealTimers();
  });

  it('renders attachment button', () => {
    const { container } = render(<MessageInput conversationId="conv-1" />);
    const attachmentButton = container.querySelector('button');
    expect(attachmentButton).toBeInTheDocument();
  });

  it('renders emoji button', () => {
    const { container } = render(<MessageInput conversationId="conv-1" />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('does not send empty message', () => {
    render(<MessageInput conversationId="conv-1" />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('does not send whitespace-only message', () => {
    render(<MessageInput conversationId="conv-1" />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: '   ' } });
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });
});