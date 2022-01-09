const mongodb=require('mongodb')
const mongoClient=mongodb.MongoClient;
const dotenv =require('dotenv');
dotenv.config();
const url=process.env.DB;



 const Recruitercheck = async (req,res,next)=>{
     console.log(req.userid);
    try {
        // connect the database
         
        let client =await mongoClient.connect(url);
        let db= client.db("job");
        
        let check=await db.collection('recruiter').findOne({_id: mongodb.ObjectId(req.userid)});
        
      console.log(check);
    
        let value=check.recruiter


        if(value){
            
         await client.close();
            next();
        } else {
        await client.close();
     
        res.status(401).json({ message: "You are not allowed to see this data"})
        }
      } catch (error) {
        console.log(error);
        res.status(401).json({
          message: "You are not allowed to see this data"
      })
      }
}

module.exports=Recruitercheck;