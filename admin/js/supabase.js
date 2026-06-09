// Supabase Initialization
// IMPORTANT: Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'https://uicuadqmvmwhtepkzvfi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KEfEgsBf_qXePvbM5zlHOw_peYMuj8p';

// Check if CDN is loaded
if (typeof supabase === 'undefined') {
    console.error('Supabase CDN not loaded. Please check your internet connection or the script tag.');
}

// Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;

// Toast Notification Utility
window.showToast = function(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};
