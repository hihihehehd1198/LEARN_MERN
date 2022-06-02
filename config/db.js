//connect db monogo link to project
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURL');


const connectDB = async()=>{
    try{
        await mongoose.connect(db);
        console.log('connect ok ?')
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}
module.exports = connectDB;
