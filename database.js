// This  module defines a database connection to MongoDB
  
 
import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config();  
mongoose.connect( process.env.MONGODB )
  .then(mongoose => {   
    console.log(`Mongoose ${mongoose.version} connected to MongoDB.`)
    console.log(`Host: ${mongoose.connection.host}`)
  })
  .catch(error => handleError(error)); 

const handleError = (error)=>{
  console.log("MongoDB connection failed.")
  console.log(error.message)
  if (process.env.MONGODB){
    console.log("MONGODB="+process.env.MONGODB) 
  }    
  else{
    console.log("MONGODB environment variable not found.") 
  }
}
 
function mongoReady(req, res, next) { 
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).send()
    }
    next();
}

export {mongoReady}
  