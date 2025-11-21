import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Parse CSV content
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const emailIndex = headers.indexOf('email');
  const nameIndex = headers.indexOf('name');

  if (emailIndex === -1) {
    throw new Error('CSV must have an "email" column');
  }

  const subscribers = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Simple CSV parsing (handles quoted values)
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const email = values[emailIndex]?.replace(/"/g, '').trim();
    const name = nameIndex !== -1 ? values[nameIndex]?.replace(/"/g, '').trim() : '';

    if (email && isValidEmail(email)) {
      subscribers.push({
        email,
        name: name || null,
        status: 'active'
      });
    }
  }

  return subscribers;
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('sb-access-token');

    if (!authCookie) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(authCookie.value);

    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: account } = await supabase
      .from('nwp_accounts')
      .select('role')
      .eq('user_uid', user.id)
      .single();

    if (!account || !['administrator', 'editor'].includes(account.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file content
    const content = await file.text();

    // Parse CSV
    let subscribers;
    try {
      subscribers = parseCSV(content);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (subscribers.length === 0) {
      return Response.json({ error: 'No valid subscribers found in CSV' }, { status: 400 });
    }

    // Import subscribers
    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        // Check if subscriber already exists
        const { data: existing } = await supabase
          .from('nwp_newsletter_subscribers')
          .select('id')
          .eq('email', subscriber.email)
          .single();

        if (existing) {
          skipped++;
          continue;
        }

        // Insert new subscriber
        const { error: insertError } = await supabase
          .from('nwp_newsletter_subscribers')
          .insert(subscriber);

        if (insertError) {
          console.error('Error inserting subscriber:', insertError);
          failed++;
        } else {
          imported++;
        }
      } catch (error) {
        console.error('Error processing subscriber:', error);
        failed++;
      }
    }

    return Response.json({
      success: true,
      results: {
        imported,
        skipped,
        failed,
        total: subscribers.length
      }
    });

  } catch (error) {
    console.error('Import error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
