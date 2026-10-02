import mongoose from "mongoose";


const foodSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  imageUrl:{
    type:String,
    default:"https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png"
  },
  foodTags:{
    type:[String]
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
  },
  resturant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Resturant"
  },
  code:{
    type:String
  },
  isAvailable:{
    type:Boolean,
    default:true
  },
  isVeg:{
    type:Boolean,
    default:false
  },
  rating:{
    type:Number,
    min:1,
    max:5,
    default:5,
  },
  ratingcount:{
    type:Number,
    default:0
  }
},{timestamps:true})

const Food=mongoose.model("Food",foodSchema)
export default Food