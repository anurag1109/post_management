const mongoose = require("mongoose");
const userschema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    password: { type: String, required: true },
    is_married: { type: Boolean, required: true },
  },
  { strict: false }
);

const usermodel = mongoose.model("users", userschema);

const postschema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    device: { type: String, required: true },
    no_of_comments: { type: Number, required: true },
  },
  { strict: false }
);
const postmodel = mongoose.model("posts", postschema);

module.exports = { usermodel, postmodel };
