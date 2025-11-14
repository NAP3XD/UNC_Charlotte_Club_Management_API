import express from 'express';

import authRoutes from './routes/authRoutes.js';




const app = express();
const PORT = process.env.PORT || 3000;

// middleware to parse JSON
app.use(express.json());



app.use('/api/auth', authRoutes);






app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



export default app;