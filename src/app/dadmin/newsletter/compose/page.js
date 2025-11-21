'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EmailComposer from '../components/EmailComposer';

export default function ComposePage() {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, emailsRes] = await Promise.all([
        fetch('/api/newsletter/stats'),
        fetch('/api/newsletter/emails')
      ]);

      const statsData = await statsRes.json();
      const emailsData = await emailsRes.json();

      if (statsData.success) {
        setSubscriberCount(statsData.stats.active);
      }

      if (emailsData.success) {
        setEmailHistory(emailsData.emails);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Email sent successfully!');
        await fetchData();
      } else {
        alert('Failed to send email: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    if (status === 'sent') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-stone-900 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">Compose Email</h1>
                  <p className="text-stone-600">
                    Create and send emails to your subscribers
                  </p>
                </div>
              </div>
              <Link
                href="/dadmin/newsletter"
                className="px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
              >
                Back to Newsletter
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Email Composer */}
              <EmailComposer
                subscriberCount={subscriberCount}
                onSend={handleSendEmail}
              />

              {/* Email History */}
              {emailHistory && emailHistory.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-stone-900">Recent Emails</h2>
                  <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                    <div className="divide-y divide-stone-200">
                      {emailHistory.map((email) => (
                        <div key={email.id} className="p-4 hover:bg-stone-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(email.status)}
                                <h4 className="font-medium text-stone-900">{email.subject}</h4>
                              </div>
                              <p className="text-sm text-stone-600 mb-2 line-clamp-2">
                                {email.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-stone-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(email.sent_at)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  Sent to {email.recipient_count} subscriber(s)
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
