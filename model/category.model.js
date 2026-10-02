import mongoose from "mongoose";

const CategorySchema=new mongoose.Schema({
  resturant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Resturant",
    
  },
  title:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    default:"https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png"
  }
},{timestamps:true})


const Category=mongoose.model("Category",CategorySchema)
export default Category