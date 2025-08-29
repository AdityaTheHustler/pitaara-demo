document.addEventListener('DOMContentLoaded', async function() {
    // Get ID token from localStorage (set after login)
    const idToken = localStorage.getItem('google_id_token');
    const dashboardContent = document.getElementById('dashboard-content');

    if (!idToken) {
        dashboardContent.innerHTML = '<p>Please sign in with your Google account.</p>';
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/business-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });
        const data = await res.json();

        if (data.error === 'not_business_account') {
            dashboardContent.innerHTML = '<p style="color:red;">Please use your business Google account.</p>';
        } else if (data.error) {
            dashboardContent.innerHTML = `<p style="color:red;">${data.error}</p>`;
        } else {
            // Render business profile data
            dashboardContent.innerHTML = `
                <h2>${data.businessName}</h2>
                <p><strong>Address:</strong> ${data.address}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                <!-- Add more fields as needed -->
            `;
        }
    } catch (err) {
        dashboardContent.innerHTML = '<p style="color:red;">Failed to fetch business data.</p>';
    }
});