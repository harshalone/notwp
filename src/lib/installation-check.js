/**
 * Check if the application has been installed
 * This runs on the client side
 */
export async function checkInstallation() {
  try {
    // Get credentials from localStorage
    const supabaseUrl = localStorage.getItem('nwp_supabase_url');
    const supabaseAnonKey = localStorage.getItem('nwp_supabase_anon_key');

    if (!supabaseUrl || !supabaseAnonKey) {
      return false;
    }

    const response = await fetch(
      `/api/install/check-installation?url=${encodeURIComponent(supabaseUrl)}&key=${encodeURIComponent(supabaseAnonKey)}`
    );
    const data = await response.json();

    // Update cache based on result
    if (data.installed) {
      setCachedInstallationStatus(true);
      return true;
    } else {
      setCachedInstallationStatus(false);
      return false;
    }
  } catch (error) {
    console.error('Error checking installation:', error);
    return false;
  }
}

/**
 * Check installation status from localStorage cache
 * This provides immediate feedback without API calls
 */
export function getCachedInstallationStatus() {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem('nwp_installation_complete');
  if (cached === null) return null;

  return cached === 'true';
}

/**
 * Update cached installation status
 */
export function setCachedInstallationStatus(installed) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('nwp_installation_complete', installed.toString());
}

/**
 * Clear cached installation status
 */
export function clearCachedInstallationStatus() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('nwp_installation_complete');
}
