const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stations', require('./routes/stations.routes'));
app.use('/api/trains', require('./routes/trains.routes'));
app.use('/api/carriages', require('./routes/carriages.routes'));
app.use('/api/seats', require('./routes/seats.routes'));
app.use('/api/prices', require('./routes/prices.routes'));
app.use('/api/schedules', require('./routes/schedules.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/coupons', require('./routes/coupons.routes'));
app.use('/api/refunds', require('./routes/refunds.routes'));
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});