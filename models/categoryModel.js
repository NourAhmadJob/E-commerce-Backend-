const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true,
    require: [true, "Please enter a name category"],
  },
  image: String,
  // slugy: {
  //     type: String,
  //     default :
  // }
});

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne , findAll and update
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});
// Create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
