import express from 'express';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware to parse JSON
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/clubs', clubRoutes);
app.use('/events', eventRoutes);
app.use('/announcements', announcementRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;