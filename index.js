// Express is a framework for building APIs and web apps
// See also: https://expressjs.com/
import express from 'express'  
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

dotenv.config();

// CORS middleware add CORS headers to our endpoints 
// This will allow us to use the API on any domain. 
// See also: https://www.npmjs.com/package/cors
// Tell our Express app to add CORS headers
import cors from 'cors'
app.use(cors())

/*app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });  */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

// serve up the frontend (documentation)
app.use(express.static( 'public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', express.static(path.join(__dirname, 'api')));
// Enable express to parse JSON data
app.use(express.json()) 

// Our API is defined in separate modules to keep things tidy.
// Let's import our API endpoints and activate them.
// Note that the '/api' prefix is important here:

// Here are the basic CRUD endpoints for image metadata
import { crudEndpoints } from './api/crud.js'
app.use('/api', crudEndpoints)
 
// Express starts listening   
app.listen(process.env.PORT,() => console.log(`Express is Live.${process.env.PORT}`))
