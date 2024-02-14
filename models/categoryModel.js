const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3, 
        unique: true,
        require : [true , 'Please enter a name category']
    },
    image : String,
    // slugy: {
    //     type: String,
    //     default : 
    // }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category;