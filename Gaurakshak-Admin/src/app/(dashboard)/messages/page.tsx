'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchMessages, markMessageAsRead } from '@/redux/slices/messageSlice';
import { toast } from 'react-hot-toast';
import { FiMail, FiMessageSquare, FiX } from 'react-icons/fi';
import { ContactMessage } from '@/types';

export default function MessagesAdminPage() {
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.messages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  const handleOpenMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      dispatch(markMessageAsRead(message._id)).then(() => {
        toast.success('Message marked as read');
      });
    }
  };

  return (
    <div className="admin-card p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-lg font-bold text-stone-900">Contact Messages</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-stone-400">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Unread: {messages.filter(m => !m.isRead).length}
          <span className="ml-2 w-2 h-2 rounded-full bg-stone-300 inline-block" /> Total: {messages.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-6 text-stone-500 font-bold">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-stone-400 font-semibold flex flex-col items-center gap-3">
          <FiMessageSquare className="w-10 h-10" />
          <p>No contact messages received yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message._id}
              onClick={() => handleOpenMessage(message)}
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-sm sm:gap-4 sm:p-5 ${
                message.isRead
                  ? 'bg-white border-stone-100 hover:border-stone-200'
                  : 'bg-blue-50/50 border-blue-100 hover:border-blue-200'
              }`}
            >
              {/* Read/Unread Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                message.isRead
                  ? 'bg-stone-100 text-stone-400'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {message.isRead ? <FiMail className="w-5 h-5 opacity-60" /> : <FiMail className="w-5 h-5" />}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <h4 className={`text-sm truncate ${message.isRead ? 'font-semibold text-stone-700' : 'font-bold text-stone-900'}`}>
                    {message.subject}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-bold shrink-0">
                    {new Date(message.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>
                <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-stone-500 font-semibold">
                  <span>{message.name}</span>
                  <span>•</span>
                  <span className="truncate">{message.email}</span>
                  {message.phone && <><span>•</span><span>{message.phone}</span></>}
                </div>
                <p className="text-xs text-stone-500 mt-1 line-clamp-1 font-medium">{message.message}</p>
              </div>

              {/* Unread badge */}
              {!message.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"
            >
              <FiX className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-stone-100 pr-8">
              <div className="w-12 h-12 bg-saffron-50 text-saffron-600 rounded-xl flex items-center justify-center font-bold text-lg border border-saffron-100">
                {selectedMessage.name.charAt(0)}
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <h3 className="text-lg font-bold text-stone-900">{selectedMessage.name}</h3>
                <span className="break-words text-xs text-stone-400 font-semibold">{selectedMessage.email} {selectedMessage.phone && `• ${selectedMessage.phone}`}</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block mb-1">Subject</span>
              <h4 className="text-base font-bold text-stone-900">{selectedMessage.subject}</h4>
            </div>

            <div className="mb-6">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block mb-2">Message</span>
              <p className="text-sm text-stone-700 leading-relaxed font-medium whitespace-pre-wrap bg-stone-50 p-4 rounded-2xl border border-stone-100">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-stone-400 font-bold">
                Received on {new Date(selectedMessage.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2 rounded-xl font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
