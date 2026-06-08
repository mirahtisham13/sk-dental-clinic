// auth.js
// Handles authentication state and route protection

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check current session
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!session && !isLoginPage) {
        // Not logged in, trying to access protected page -> redirect to login
        window.location.href = 'login.html';
        return;
    }

    if (session && isLoginPage) {
        // Logged in, trying to access login page -> redirect to dashboard
        window.location.href = 'cases.html';
        return;
    }

    // 2. Handle Login Form (if on login page)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                errorMsg.textContent = error.message;
                errorMsg.style.display = 'block';
            } else {
                window.location.href = 'cases.html';
            }
        });
    }

    // 3. Handle Logout Button (if on protected page)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const { error } = await supabaseClient.auth.signOut();
            if (!error) {
                window.location.href = 'login.html';
            } else {
                alert('Error logging out: ' + error.message);
            }
        });
    }
});
