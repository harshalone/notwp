/**
 * Check if the application has been installed by querying the database
 * This checks if the nwp_accounts table exists
 */
export async function checkInstallation(supabaseUrl, supabaseAnonKey) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return false;
    }

    const response = await fetch(
      `/api/install/check-installation?url=${encodeURIComponent(supabaseUrl)}&key=${encodeURIComponent(supabaseAnonKey)}`
    );
    const data = await response.json();

    return data.installed;
  } catch (error) {
    console.error('Error checking installation:', error);
    return false;
  }
}
