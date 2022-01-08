const express = require('express');
const app=express();
const Mongodb=require('mongodb');
const mongoClient=Mongodb.MongoClient;
const cors=require('cors');
const env=require('dotenv');
env.config();

const PORT=process.env.PORT || 3005;


app.use(express.json());

app.use(cors({
    origin:"*"
}));

app.listen(PORT,()=>{
    console.log(`server Running port Number ${PORT}`);
})