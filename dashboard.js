document.addEventListener('DOMContentLoaded', async function() {
    const idToken = localStorage.getItem('google_id_token');
    const dashboardContent = document.getElementById('dashboard-content');

    if (!idToken) {
        dashboardContent.innerHTML = '<p>Please sign in with your Google account.</p>';
        return;
    }

    try {
        const res = await fetch('https://pitaara-api.vercel.app/api/business-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });

        if (!res.ok) {
            dashboardContent.innerHTML = `<p style="color:red;">Server error: ${res.status}</p>`;
            return;
        }

        const data = await res.json();

        if (data.error === 'not_business_account') {
            dashboardContent.innerHTML = '<p style="color:red;">Please use your business Google account.</p>';
        } else if (data.error) {
            dashboardContent.innerHTML = `<p style="color:red;">${data.error}</p>`;
        } else {
            dashboardContent.innerHTML = `
                <h2>${data.businessName}</h2>
                <p><strong>Address:</strong> ${data.address}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
            `;
        }
    } catch (err) {
        dashboardContent.innerHTML = `<p style="color:red;">Network error: ${err.message}</p>`;
    }
});