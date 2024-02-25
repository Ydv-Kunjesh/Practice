const mongoose = require("mongoose")
const Schema = mongoose.Schema;

listingSchema = new Schema({
    title:{type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://i.pinimg.com/236x/28/cc/81/28cc81be7e525ac94fa44067dcbe1e7c.jpg",   
    },
    price:Number,
    location:String, 
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"review"
        }
    ]
});

const Listing = mongoose.model('listing',listingSchema)


module.exports = Listing