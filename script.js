// --- DOM Element References ---
const loginView = document.getElementById('login-view');
const profileView = document.getElementById('profile-view');
const profilePic = document.getElementById('profile-pic');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const signOutBtn = document.getElementById('sign-out-btn');

/**
 * Decodes a JSON Web Token (JWT) to extract its payload.
 */
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
    }
}

/**
 * Handles the credential response from Google Sign-In.
 */
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    if (!responsePayload) return;
    updateProfileUI(responsePayload);
    // Save ID token for dashboard
    localStorage.setItem('google_id_token', response.credential);
    showProfileView();
}

/**
 * Updates the profile UI elements with user data.
 */
function updateProfileUI(payload) {
    if (profilePic) profilePic.src = payload.picture;
    if (profileName) profileName.textContent = payload.name;
    if (profileEmail) profileEmail.textContent = payload.email;
}

/**
 * Hides the login view and shows the profile view, then redirects.
 */
function showProfileView() {
    if (loginView) loginView.classList.add('hidden');
    if (profileView) profileView.classList.remove('hidden');
    setTimeout(function() {
        window.location.href = "home.html";
    }, 1000);
}

/**
 * Hides the profile view and shows the login view.
 */
function showLoginView() {
    if (profileView) profileView.classList.add('hidden');
    if (loginView) loginView.classList.remove('hidden');
}

/**
 * Signs the user out.
 */
function signOut() {
    if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }
    showLoginView();
}

// --- Event Listeners ---
if (signOutBtn) {
    signOutBtn.addEventListener('click', signOut);
}

// --- Form Login Redirect ---
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.pitaara-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = "home.html";
        });
    }
});

