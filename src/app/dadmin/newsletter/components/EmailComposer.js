'use client';

import { useState } from 'react';
import { Send, X } from 'lucide-react';

export default function EmailComposer({ subscriberCount, onSend, onClose }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both subject and message');
      return;
    }

    if (!confirm(`Send this email to ${subscriberCount} subscriber(s)?`)) {
      return;
    }

    setSending(true);
    try {
      await onSend({ subject, message });
      setSubject('');
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Send Email to Subscribers</h2>
          <p className="text-sm text-stone-600 mt-1">
            This email will be sent to {subscriberCount} active subscriber(s)
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        )}
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={8}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <p className="text-sm text-stone-600">
            Your email will be sent immediately
          </p>
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </form>
    </div>
  );
}
