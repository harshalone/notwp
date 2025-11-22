'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/10 mb-4">
              <Mail className="w-8 h-8 text-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the latest updates, tutorials, and insights about NotWP delivered straight to your inbox.
              Join our community of developers building better websites.
            </p>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-2xl p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full sm:w-auto px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-4 rounded-lg text-sm ${
                    status === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message}
                </div>
              )}
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground mt-6 text-center">
              We respect your privacy. Unsubscribe at any time. No spam, just valuable content.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">Weekly</div>
              <p className="text-sm text-muted-foreground">Updates & tips</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">No Spam</div>
              <p className="text-sm text-muted-foreground">Quality over quantity</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">Exclusive</div>
              <p className="text-sm text-muted-foreground">Subscriber-only content</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
