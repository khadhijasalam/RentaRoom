
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
// mongoose

const {campgroundSchema}=require('./validateSchema.js')
const catchAsync= require("./utils/catchAsync.js");
const ExpressError= require("./utils/ExpressError.js")
const methodOverride = require("method-override");
require('dotenv').config();
const morgan = require("morgan");
const Campground = require("./models/campground.js");

  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("mongoose Database connected"))
  .catch((err) => console.log("Error in moongoose",err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.set();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));


const validateCampground=(req,res,next)=>{
  
   const {error}= campgroundSchema.validate(req.body);
   if(error){
    const msg= error.details.map(el=> el.message).join(',')
    throw new ExpressError(msg,400)
   }else{
    //crucial;
    next();
   }
  
}





// //all
// app.get("/campgrounds", catchAsync(async (req, res) => {
//   // use Model name.find
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// }));

app.get("/campgrounds", catchAsync(async (req, res) => {
  const { q } = req.query;

  // If search query is provided
  let campgrounds;
  if (q) {
    campgrounds = await Campground.find({
  $or: [
    { title: { $regex: q, $options: "i" } },
    { location: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } }
  ]
});

  } else {
    campgrounds = await Campground.find({});
  }

  res.render("campgrounds/index", { campgrounds, q });
}));

//create new camp
app.get("/campgrounds/new",(req, res) => {
  res.render("campgrounds/new");
});
app.post("/campgrounds", validateCampground,catchAsync(async (req, res,next) => {

    // if(!req.body.campground) throw new ExpressError("Invalid campground Data",400)
 
    const newCampground = new Campground(req.body.campground);
    console.log(newCampground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);

}));

//View details
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/viewDetails", { campground });
}));

//edit
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id",validateCampground, catchAsync(async (req, res) => {
  // res.send("hey")
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  //  console.log(req.body.campground)

  res.redirect(`/campgrounds/${campground._id}`);
}));

//delete
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const d = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));
app.all('/*',(req,res,next)=>{
  next(new ExpressError('PATH IS WRONG/ Page not found',404))
  
})
app.use((err,req,res,next)=>{
  const {statusCode=500, message='Page not working'}= err;
  if(!err.message) err.message='Oh No, Something Went Wrong!'
  res.status(statusCode).render('error',{err});

  // res.send("oh Girl...Something went wrong")
  console.log('oh oh')

})

// console.log(__dirname)
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
