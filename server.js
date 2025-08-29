const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const { businessprofile } = require('googleapis').businessprofile;

const CLIENT_ID = '1063842187490-jp1kam8ai78l2pa2fkh6ftbj0sh8o91t.apps.googleusercontent.com';
const app = express();
app.use(cors());
app.use(express.json());

const oAuth2Client = new OAuth2Client(CLIENT_ID);

app.post('/api/business-profile', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'Missing token' });

    try {
        // Verify ID token
        const ticket = await oAuth2Client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if account is business (basic check: hostedDomain or email type)
        if (!payload.email_verified || !payload.email) {
            return res.json({ error: 'not_business_account' });
        }

        // You need OAuth2 access token for Business Profile API (not just ID token)
        // For demo, we only show basic info. For real API access, implement OAuth2 flow.

        // Example: Return dummy business data
        res.json({
            businessName: 'Demo Business',
            address: '123 Main St, City',
            status: 'Active',
            phone: '+91-9876543210'
        });

        // For real API access, use googleapis and OAuth2 access token:
        // const businessProfile = businessprofile({ version: 'v1', auth: oAuth2Client });
        // const locations = await businessProfile.accounts.locations.list({ parent: 'accounts/{accountId}' });
        // res.json(locations.data);

    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});