'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function CompactNewsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
        setName('');

        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex-1 w-full sm:max-w-xs">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            />
          </div>

          <div className="flex-1 w-full sm:max-w-xs">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full sm:w-auto px-6 py-2.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2 text-sm whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Subscribing...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Subscribed!
              </>
            ) : (
              <>
                Subscribe
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          No spam, ever. Unsubscribe anytime.
        </p>

        {/* Status Message */}
        {message && (
          <div
            className={`mt-3 p-3 rounded-lg text-xs text-center ${
              status === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
