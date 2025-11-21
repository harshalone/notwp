'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Settings, Mail, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewsletterSettingsPage() {
  const [formData, setFormData] = useState({
    awsRegion: '',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    fromEmail: '',
    fromName: ''
  });
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/settings');
      const data = await response.json();

      if (data.success && data.settings) {
        setFormData({
          awsRegion: data.settings.aws_region || '',
          awsAccessKeyId: data.settings.aws_access_key_id || '',
          awsSecretAccessKey: data.settings.aws_secret_access_key || '',
          fromEmail: data.settings.from_email || '',
          fromName: data.settings.from_name || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/newsletter/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/newsletter/settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Connection test successful! AWS SES is configured correctly.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Connection test failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error testing connection' });
    } finally {
      setTesting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">Email Settings</h1>
                  <p className="text-stone-600">
                    Configure AWS SES for sending newsletter emails
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
                <p className="text-stone-600">Loading settings...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Info Banner */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">About AWS SES</h3>
                    <p className="text-sm text-blue-700 mb-2">
                      Amazon Simple Email Service (SES) is a reliable, scalable email service.
                      You'll need an AWS account with SES enabled to send newsletters.
                    </p>
                    <a
                      href="https://aws.amazon.com/ses/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                    >
                      Learn more about AWS SES →
                    </a>
                  </div>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`mb-6 rounded-lg border p-4 ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${
                      message.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {message.text}
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900 mb-4">AWS Credentials</h2>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="awsRegion" className="block text-sm font-medium text-stone-700 mb-2">
                          AWS Region *
                        </label>
                        <input
                          type="text"
                          id="awsRegion"
                          name="awsRegion"
                          value={formData.awsRegion}
                          onChange={handleChange}
                          placeholder="us-east-1"
                          required
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-stone-500">
                          Example: us-east-1, eu-west-1, ap-southeast-1
                        </p>
                      </div>

                      <div>
                        <label htmlFor="awsAccessKeyId" className="block text-sm font-medium text-stone-700 mb-2">
                          AWS Access Key ID *
                        </label>
                        <input
                          type="text"
                          id="awsAccessKeyId"
                          name="awsAccessKeyId"
                          value={formData.awsAccessKeyId}
                          onChange={handleChange}
                          placeholder="AKIA..."
                          required
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="awsSecretAccessKey" className="block text-sm font-medium text-stone-700 mb-2">
                          AWS Secret Access Key *
                        </label>
                        <div className="relative">
                          <input
                            type={showSecretKey ? "text" : "password"}
                            id="awsSecretAccessKey"
                            name="awsSecretAccessKey"
                            value={formData.awsSecretAccessKey}
                            onChange={handleChange}
                            placeholder="••••••••••••••••••••"
                            required
                            className="w-full px-4 py-2 pr-12 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent font-mono text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                          >
                            {showSecretKey ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4">Sender Information</h2>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fromEmail" className="block text-sm font-medium text-stone-700 mb-2">
                          From Email Address *
                        </label>
                        <input
                          type="email"
                          id="fromEmail"
                          name="fromEmail"
                          value={formData.fromEmail}
                          onChange={handleChange}
                          placeholder="newsletter@yourdomain.com"
                          required
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-stone-500">
                          This email must be verified in AWS SES
                        </p>
                      </div>

                      <div>
                        <label htmlFor="fromName" className="block text-sm font-medium text-stone-700 mb-2">
                          From Name *
                        </label>
                        <input
                          type="text"
                          id="fromName"
                          name="fromName"
                          value={formData.fromName}
                          onChange={handleChange}
                          placeholder="Your Company Newsletter"
                          required
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-stone-200">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-lg font-medium transition-all"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testing || !formData.awsRegion || !formData.awsAccessKeyId || !formData.awsSecretAccessKey}
                      className="px-6 py-2.5 bg-white border-2 border-stone-300 hover:border-stone-400 disabled:border-stone-200 disabled:text-stone-400 text-stone-700 rounded-lg font-medium transition-all"
                    >
                      {testing ? 'Testing...' : 'Test Connection'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Security Notice */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Security Notice</h3>
                    <p className="text-sm text-amber-700">
                      Your AWS credentials are stored securely and encrypted. Never share your secret access key.
                      We recommend using IAM credentials with minimal permissions (only SES send access).
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
