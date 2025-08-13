const express = require('express');
const studentRouter = require('./routes/stdRouter');
const cors = require('cors')
const connectDB = require('./db');

const app = express();

app.use(express.json());
app.use(cors())
app.use('/api',studentRouter);

connectDB();

app.listen(2500,()=>{
    console.log("Server is running ... ");
    
})

