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


app.get("/", (req, res) => {
  res.send("Server is running!");
});


// CORS configuration
app.use(
  cors({
    origin: "https://client-pjphq6o1s-saluumaas-projects.vercel.app",  // No trailing slash
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the required methods
    credentials: true,  // Allow credentials (cookies, etc.)
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow the required headers
  })
);


app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/cases', caseRoute)
app.use('/api/admin', adminRoute)

const PORT = process.env.PORT || 3001;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
