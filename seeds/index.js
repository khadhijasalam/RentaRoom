
const mongoose=require('mongoose')

const Campground= require('./../models/campground')
const {descriptors,places}= require('./seedHelpers')

const cities= require('./cities')


// Uncomment and Run to seed the db
//   mongoose.connect(process.env.MONGO_URI)
// .then(()=>console.log("mongoose connected"))
// .catch((err)=>console.log("Error in moongoose",err))

const seedDB=async()=>{
  await Campground.deleteMany({});
for (let i=0; i<50; i++){

const random1000 = Math.floor(Math.random()*1000)
  const sample=(arr)=>{  return arr[Math.floor(Math.random()*arr.length)]}
//  console.log(cities[random1000])

const price= Math.floor(Math.random()*20)+30

  const c= new Campground({
    
    location:`${cities[random1000].city} ${cities[random1000].state}`,
    title:`${sample(descriptors)} ${sample(places)}`,image: `https://picsum.photos/400?random=${Math.random()}`,
    
    description:'   Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur quod dicta earum reiciendis nulla assumenda, voluptatem quisquam aliquid voluptas libero dignissimos fugit quasi enim saepe a incidunt facilis! Accusamus, beatae?',price:price

 

  })
  await c.save()
}
}


seedDB().then(()=>mongoose.connection.close());