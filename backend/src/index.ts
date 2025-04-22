import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import { AuthRoutes } from './routes/auth.route';
import { ProfileRoutes } from './routes/profile.route';
import { DashboardRoutes } from './routes/dashboard.route';
import { JobRoutes } from './routes/job.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = ['http://localhost:4200', 'http://13.51.238.17'];

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('All systems stable.');
});

app.use('/api/auth', AuthRoutes);
app.use('/api/profile', ProfileRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/jobs', JobRoutes)

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  }
);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('TypeORM connection error: ', error));
