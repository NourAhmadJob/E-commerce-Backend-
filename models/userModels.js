const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');


const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Please enter an email"], 
        unique: true, 
        lowecase: true,
        validate : [validator.isEmail , "Please enter a valid email"]
    }, 
    role: {
        type: String, 
        emum: ['user', 'guide', 'lead-guide', 'admin'],
        default : 'user'
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength : [6 , "Minimum password lenght is 6 characters"]
    }, 

    passwordChangedAt : Date
})

userSchema.pre("save", async function (next) { 
    
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
        
    next();
})

userSchema.methods.changedPassword = (JWTTimestamp) => { 
    
    if (this.passwordChangedAt) { 
        console.log(this.passwordChangedAt , JWTTimestamp)
    }
    // NO changed password 
    return false;
}

const User = new mongoose.model('user', userSchema);

module.exports = User;