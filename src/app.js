import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './routes/index.routes.js';
// import './models/Associations.js';
// import { sequelize } from "../config/dbConn.js";
// import { applyAssociations } from "./models/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Apply associations BEFORE syncing or using models
// applyAssociations();

// Test DB
// sequelize.authenticate()
//     .then(() => console.log("Database connected"))
//     .catch(err => console.log("DB Error:", err));

app.use(express.json());
app.use(cors({ credentials: true, methods: ["GET", "POST", "PUT", "DELETE"], origin: 'http://localhost:5173' }));
app.use(cookieParser());

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})