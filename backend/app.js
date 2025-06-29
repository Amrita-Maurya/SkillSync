import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import route files
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import accountabilityRoutes from './routes/accountabilityRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/accountability', accountabilityRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.send('Student Accountability Backend is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
