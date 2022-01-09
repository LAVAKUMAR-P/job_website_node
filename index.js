const express = require('express');
const app=express();
const cors=require('cors');
const env=require('dotenv');
const router = require('./Routes');
env.config();




const PORT=process.env.PORT || 3005;


app.use(express.json());

app.use(cors({
    origin:"*"
}));

app.use("/",router)

app.listen(PORT,()=>{
    console.log(`server Running port Number ${PORT}`);
})