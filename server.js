const express = require('express');
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const sanitizeInput = require('./middlewares/sanatizeInput'); 
const userRouter = require('./routes/userRouter');
const connectDB = require('./utils/connectDB');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(sanitizeInput); 

connectDB()

// Routes
app.use("/api/v2/users", userRouter);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
