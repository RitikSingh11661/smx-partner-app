const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TEST_USERNAME = process.env.TEST_USERNAME;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
const TEST_HOTEL_CODE = process.env.TEST_HOTEL_CODE;

// Middleware for basic authentication
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader)return res.status(401).json({ message: 'Missing authorization header' });

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === TEST_USERNAME && password === TEST_PASSWORD)next();
    else res.status(401).json({ message: 'Invalid credentials' });
};

// Endpoint to receive reservation notifications
app.post('/api/reservation', authMiddleware, (req, res) => {
    const { HotelCode, ResStatus } = req.body;
    if (HotelCode === TEST_HOTEL_CODE) {
        const validStatuses = ['Reserved','Waitlisted','Cancelled','No-show','In-house','Checked-Out','Redacted'];

        if (validStatuses.includes(ResStatus)) {
            res.status(200).json({ message: `Reservation status '${ResStatus}' received`, status: 'Success' });
        } else {
            res.status(400).json({ message: 'Invalid reservation status' });
        }
    } else res.status(400).json({ message: 'Invalid Hotel Code' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});