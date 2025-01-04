import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './auth.js';
import caseRoute from './cases.js'
import adminRoute from './admin.js'

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,
}));

app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/cases', caseRoute)
app.use('/api/admin', adminRoute)

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
