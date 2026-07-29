import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, User, Building2 } from 'lucide-react';
import { ChatMessage, Role } from '../types';
import { fetchMessages, sendMessage } from '../services/api';

interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
}

export const MessagingDrawer: React.FC<MessagingDrawerProps> = ({
  isOpen,
  onClose,
  currentRole
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadChat();
    }
  }, [isOpen]);

  const loadChat = async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const newMsg = await sendMessage({
        senderRole: currentRole,
        senderName: `${currentRole.toUpperCase()} User`,
        receiverName: 'Owner / Agent',
        text: inputText
      });
      setMessages((prev) => [...prev, newMsg]);
      setInputText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Shine Chat & Lead Messaging</h3>
              <p className="text-[10px] text-slate-400 capitalize">Logged in as {currentRole}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((msg) => {
            const isMe = msg.senderRole === currentRole;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5 px-1 flex items-center gap-1">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span>• {msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs font-medium shadow-xs ${
                    isMe
                      ? 'bg-blue-600 text-white font-semibold rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to owner/broker..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
