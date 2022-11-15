const mongoose = require('mongoose');
const { Schema } = mongoose;


const projectScheme = new mongoose.Schema({
    title: String,
    weight: Number,
    description: String,
    tasks: Array
})

module.exports = mongoose.model("project", projectScheme);
