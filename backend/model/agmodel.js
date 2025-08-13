const mongoose = require('mongoose');

const stdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    required: true,
    trim: true
  },
  regNo: { 
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: String,
    required: true
  },
  phone:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  district:{
    type:String,
    required:true
  },
  courses:{
    type:[String]
  }



});

const Student = mongoose.model('Student', stdSchema);
module.exports = Student;
