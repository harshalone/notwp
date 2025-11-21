'use client';

import { useState } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function ImportExportPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [importResults, setImportResults] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/newsletter/export');

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', text: 'Subscribers exported successfully!' });
    } catch (error) {
      console.error('Error exporting:', error);
      setMessage({ type: 'error', text: 'Failed to export subscribers' });
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setMessage({ type: 'error', text: 'Please select a CSV file' });
      return;
    }

    setImporting(true);
    setMessage({ type: '', text: '' });
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/newsletter/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Import completed successfully!' });
        setImportResults(data.results);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to import subscribers' });
      }
    } catch (error) {
      console.error('Error importing:', error);
      setMessage({ type: 'error', text: 'Failed to import subscribers' });
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = '';
    }
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
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">Import & Export</h1>
                  <p className="text-stone-600">
                    Import subscribers from CSV or export your subscriber list
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

          {/* Import Results */}
          {importResults && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Import Summary</h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>✓ {importResults.imported} subscriber(s) imported successfully</p>
                    {importResults.skipped > 0 && (
                      <p>⊘ {importResults.skipped} subscriber(s) skipped (already exists)</p>
                    )}
                    {importResults.failed > 0 && (
                      <p>✗ {importResults.failed} subscriber(s) failed (invalid data)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Section */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-stone-900 mb-2">Export Subscribers</h2>
                  <p className="text-sm text-stone-600">
                    Download all your subscribers as a CSV file
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-stone-50 rounded-lg p-4">
                  <h3 className="font-medium text-stone-900 mb-2 text-sm">Export Format</h3>
                  <p className="text-xs text-stone-600 mb-2">
                    The CSV file will include the following columns:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs font-mono">email</span>
                    <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs font-mono">name</span>
                    <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs font-mono">status</span>
                    <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs font-mono">created_at</span>
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full px-6 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Export to CSV
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Import Section */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-stone-900 mb-2">Import Subscribers</h2>
                  <p className="text-sm text-stone-600">
                    Upload a CSV file to import subscribers
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-stone-50 rounded-lg p-4">
                  <h3 className="font-medium text-stone-900 mb-2 text-sm">Required Format</h3>
                  <p className="text-xs text-stone-600 mb-2">
                    Your CSV file must include these columns:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs font-mono">email</span>
                    <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs font-mono">name</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Example: email,name<br/>
                    john@example.com,John Doe
                  </p>
                </div>

                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 hover:border-stone-400 transition-colors">
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={importing}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-stone-900 mb-1">
                        {importing ? 'Importing...' : 'Click to upload CSV file'}
                      </p>
                      <p className="text-xs text-stone-500">
                        or drag and drop
                      </p>
                    </div>
                  </label>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      Duplicate emails will be skipped. All imported subscribers will be marked as active.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Tips for Import & Export</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Export your current subscribers to see the correct CSV format</li>
                  <li>Ensure your CSV file uses UTF-8 encoding for special characters</li>
                  <li>The name field is optional but email is required</li>
                  <li>Invalid email addresses will be skipped during import</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
