const mongoose= require('mongoose')
const Schema=mongoose.Schema

//mongoose.Schema
const CampgroundSchema= new Schema({
title: {
  type:String,
  required:true
},
image: {
  type:String,
  
},
price:{
  type:Number,
},
description:{
  type:String
},
location:{
  type:String
},
reviews:[
  {type: Schema.Types.ObjectId,
  ref:'Review'}
]

})

// module.exports=mongoose.model('Campground',CampgroundSchema)
const Campground=mongoose.model('Campground',CampgroundSchema)

module.exports=Campground;

