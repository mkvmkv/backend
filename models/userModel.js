const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, reuired: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    displayName: { type: String, required: true, minlength: 3 },

});

module.exports = User = mongoose.model("user", userSchema);