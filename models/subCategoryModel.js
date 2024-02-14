const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String, 
        minlength: [2, "To short name subCategory"],
        required: true,
        unique: true
    }, 
    slugy: String, 
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category', 
        require: [true, 'Please specify a Category']
    }
}, { timeseries: true })

const SubCategory = mongoose.model('SubCategory', subCategorySchema)

module.exports =  SubCategory;