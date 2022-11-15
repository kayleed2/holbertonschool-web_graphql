const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskScheme = new mongoose.Schema({
    project: String,
    title: String,
    weight: Number,
    description: String
})

module.exports = mongoose.model("task", taskScheme);
