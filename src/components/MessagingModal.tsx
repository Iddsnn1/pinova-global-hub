import React, { useState } from 'react';
import { X, Send, MessageSquare, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessagingModalProps {
  recipientUsername: string;
  orderId?: string;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (recipientUsername: string, text: string, orderId?: string) => void;
  userUsername: string;
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  recipientUsername,
  orderId,
  onClose,
  messages,
  onSendMessage,
  userUsername
}) => {
  const [textInput, setTextInput] = useState('');

  const conversationMessages = messages.filter(
    (m) =>
      (m.senderUsername === userUsername && m.recipientUsername === recipientUsername) ||
      (m.senderUsername === recipientUsername && m.recipientUsername === userUsername)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onSendMessage(recipientUsername, textInput, orderId);
    setTextInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <div>
              <h4 className="font-bold text-sm text-white">Chat with @{recipientUsername}</h4>
              {orderId && <p className="text-[10px] text-purple-300">Order ID: {orderId}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-white/10 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950">
          {conversationMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs italic">
              No previous messages. Send a message regarding your PiNova order!
            </div>
          ) : (
            conversationMessages.map((m) => {
              const isMe = m.senderUsername === userUsername;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                      isMe
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[9px] opacity-75 block text-right mt-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-slate-300 dark:border-slate-700 outline-none"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
