import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import profileRoutes from './routes/profile';
import candidatesRoutes from './routes/candidates';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();

const app = express();

// Configure CORS explicitly
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200', // Allow your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow standard methods
  allowedHeaders: ['Content-Type', 'Authorization'], // IMPORTANT: Allow Authorization header
  credentials: true, // If you need cookies or sessions
};

app.use(cors(corsOptions)); // Use configured CORS

// Enable pre-flight requests for all routes
// This is important for complex requests (like those with Authorization headers)
app.options('*', cors(corsOptions));

app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/candidates', candidatesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware (should be after all routes)
app.use(notFound);
app.use(errorHandler);

export default app;
