import { mongoReady } from '../database.js'
import { Item } from "../models/ItemModel.js"
import express from 'express'
import multer from 'multer'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'

// Create a Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')  // Define the upload directory
    console.log('It reaches the Multer storage');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)  // Unique filename
    console.log(uniqueSuffix);
    console.log('It finished the Multer storage');
  },
})

const upload = multer({ storage });

const api = express.Router()

// CREATE ITEM (ENDPOINT)
api.post('/item', mongoReady, upload.single('imageUrl'), async (req, res) => {
  console.log(req.body);  // Logs form fields
  console.log(req.file);
  try {
    console.log('It gets to the POST');
    // If there's an uploaded file, set the imageUrl field
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Remove _id before creating the item (Mongo will automatically generate it)
    delete req.body._id;
    
    // Add the image URL to the request body
    const itemData = {
      ...req.body,
      imageUrl
    };

    // Create and save the new item
    const item = await Item.create(itemData);
    res.send(item);
  } catch (err) {
    res.status(500).send(err);
  }
})

// READ ITEMS (ENDPOINT)
api.get('/items', mongoReady, async (req, res) => {
  try {
    let filter = {}
    let sort = {}
    if (req.query.sort == "birthDate") {
      sort.birthDate = "ascending"
    }
    if (req.query.sort == "name") {
      sort.name = "descending"
    }
    const items = await Item.find(filter).sort(sort)
    res.send(items)
  } catch (err) {
    res.status(500).send(err)
  }
})

// READ SINGLE ITEM (ENDPOINT)
api.get('/item/:id', mongoReady, async (req, res) => {
  try {
    const filter = { _id: req.params.id }
    const item = await Item.findOne(filter)
    res.send(item)
  } catch (err) {
    res.status(500).send(err)
  }
})

// UPDATE ITEM (ENDPOINT)
api.put('/item/:id', mongoReady, upload.single('imageUrl'), async (req, res) => {
  try {
    console.log('IT REACHES PUT');
    const filter = { _id: req.params.id };
    console.log(req.body);
    console.log('HERE ARE REQUEST PARAMS:', req.params);

    // Handle the uploaded file
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    console.log('Image File:', req.file);

    // Merge existing fields with the new image URL if provided
    const update = {
      ...req.body,
      ...(imageUrl && { imageUrl }), // Add imageUrl only if a file was uploaded
    };
    console.log('Update Payload:', update);

    // Find and update the document
    const item = await Item.findOneAndUpdate(filter, update);

    console.log('Image url:');
    console.log(imageUrl);
    // Handle old image cleanup if applicable
    if (imageUrl != null) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const dir = path.dirname(__dirname);

      // Construct the path to the old image
      const oldImagePath = path.join(dir, item.imageUrl);

      // Check and delete the old file
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
        else console.log('Old image deleted successfully:', oldImagePath);
      });
    }

    res.send(item);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(err);
  }
});


// DELETE ITEM (ENDPOINT)
api.delete('/item/:id', mongoReady, async (req, res) => {
  try {
    const filter = { _id: req.params.id }
    // Remove the item from the database
    const item = await Item.findOneAndDelete(filter)

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dir = path.dirname(__dirname);

    console.log(dir);
    const imagePath = dir + item.imageUrl;
    console.log(imagePath);
    
    // Delete the image file from the filesystem if it exists
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return res.status(500).send({ status: "Error deleting image" });
      }
    });

    res.send({ status: "Item deleted." })
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

export { api as crudEndpoints }
