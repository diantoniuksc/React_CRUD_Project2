// This  module defines a database connection to MongoDB
  

/* Connect to MongoDB:
To connect, you must add a MongoDB connection string
as an environment variable (i.e. Replit "Secret")
The name/key of the environment variable must be "MONGODB"
The value of the variable must be a valid MongoDB connection string. 
You can locate the string in your MongoDB Atlas dashboard.
See also: https://account.mongodb.com/account/login  
See also: https://mongoosejs.com/docs/connections.html */ 
 
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
  