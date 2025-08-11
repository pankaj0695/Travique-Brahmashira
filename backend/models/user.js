const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  age: {
    type: Number,
    min: 0,
    max: 80
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phoneno:{
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  city: {
    type: String,  
    required: true,
    trim: true
  },    
  country: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,   
    trim: true,
    maxlength: 500
    },
            
  password: {
    type: String,
    required: true
  },
  image: {
    type: String, // store image URL or path
    default: 'default-profile.png' // you can set a default image
  }
}, {
  timestamps: true
});

const User = mongoose.model("user", userSchema);
module.exports = User;
