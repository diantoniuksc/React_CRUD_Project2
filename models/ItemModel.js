import mongoose from 'mongoose'
  
const schema = new mongoose.Schema({
  name: { type: String, required: true }, // User Name
  birthDate: { type: Date, required: true }, // Birth Date
  primaryColor: { type: String, required: true }, // Favorite Color
  ethnicity: { type: String, enum: ["Caucasian", "African", "Asian", "Hispanic", "Indigenous", "Other"], required: true }, // Ethnicity
  description: { type: String, required: true }, // Biography
  personality: { type: Number, min: 0, max: 10 }, // Introvert/Extrovert Rating
  status: { 
    type: String, 
    enum: ["single", "married", "divorced", "widowed", "partnership"], 
    required: true 
  }, // Civil Status
  idNumber: { type: Number, required: true, unique: true }, // Identification Number
  imageUrl: { type: String, required: false }, // URL for the uploaded image
}); 

const Item = mongoose.model('Items', schema);
  

export { Item };