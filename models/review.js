const mongoose = require('mongoose')
const Schema= mongoose.Schema;

const reviewSchema= new Schema({
bode:String,
rating: Number
});


module.exports= mongoose.model('Rating',reviewSchema);