const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,

    },
    password :{
        type:String,
        required:true,

    },
    phoneNumber: {
        type:Number,
    },
    birth: {
        type:Date,
        default: Date.now()

    },
    avatar:{
        type:String,
    }
});
module.exports=  User = mongoose.model('users' , UserSchema);