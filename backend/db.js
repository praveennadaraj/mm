const mongoose = require('mongoose');
const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb+srv://praveen2005525:Praveen2552005@membersdetails.f5ervll.mongodb.net/?retryWrites=true&w=majority&appName=membersDetails')
        console.log('MongoDB connected ...')
            
    }catch(err){
        console.log("Error:",err.message)

    }
}

module.exports = connectDB;