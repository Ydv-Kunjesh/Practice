const express = require('express')
const app = express()
const mongo = require('mongoose')
const Listing = require('./models/listing.js')
const Reviews = require('./models/rating.js')
const path = require('path');
const methodOverride = require('method-override')
const ejsMAte = require('ejs-mate');
const wrapAsync = require("./jarurifiles/wrapAsync.js")
const expressError = require("./jarurifiles/Errors.js")
const {listingSchema ,ratingSchema} = require("./jarurifiles/schemaValidator.js");
const { error } = require('console');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMAte)
//connection
mongo.connect('mongodb://127.0.0.1:27017/Project').then((res)=>{console.log(`Database Connected`);}).catch((err)=>{console.log(err);})


// serverside error handeller

listingvalidator = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new expressError(400,msg);        
    }else{
        next();
    }
}
reviewValidator = (req,res,next)=>{
    const {error} = ratingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new expressError(400,msg);        
    }else{
        next();
    }
}

// *************************************************************

app.get("/",(req,res)=>{
    res.send('working')
}) 

// app.get("/test-listing",async(req,res)=>{
//     let sample = new Listing({
//         title:"Kunjesh Yadav",
//         description:"Villa",
//         image:" ",
//         price:1000,
//         location:"Delhi",
//         country:'India',

//     });
//     await sample.save();
//     res.send('Sample Data Saved')
// })

// INDEX ROUTE
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings})

}))
//SHOW ROUTE

app.get("/listing/:id",wrapAsync(async(req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listings/show.ejs',{listing})
}))

//NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});

app.post("/listing/new",listingvalidator,wrapAsync(async(req,res  ,next)=>{
    // if(!req.body.listing){
    //     throw new expressError(400,"send a valid data for registration")
    // }
    // let checkValidation = listingSchema.validate(req.body)
    // // console.log(checkValidation);
    // if(checkValidation.error){
    //     let validationError = checkValidation.error.details.map(el => el.message).join(",")
    //     throw new expressError(400,validationError)
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")   
}))

//EDIT Route
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))

// update Route 
app.put("/listing/:id/edit",wrapAsync(async(req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect("/listings")
}))
//Delete Route
app.delete("/listing/:id/delete",wrapAsync(async(req,res)=>{
    id = req.params.id;
    const listing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))
//Reviews route
app.post('/listings/:id/reviews',wrapAsync(async(req,res)=>{
     let listing = await Listing.findById(req.params.id)
     let rating = new Reviews(req.body.review)
     listing.reviews.push(rating)
     await rating.save();
     await listing.save();
     console.log(listing);
     res.redirect(`/listing/${listing._id}`)
    //
}))
//Delte Reviews Route
app.delete("listings/:id/reviews/reviewId",
wrapAsync(async(req,res)=>{
    let {id,reviewId}= req.params;
    res.send('Sucess')
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
    // res.redirect()
}))

//Error Handelling Middlewares
app.all("*",(req,res,next)=>{
    next (new expressError(404,"Page Not Found "))
})
app.use((err,req,res,next)=>{
    console.log(err);
    let{statusCode=500,message="something Went Wrong"} = err;
    res.status(statusCode).render('errorHandeller/error.ejs',{message})
    // res.status(statusCode).send(message);
    // res.send(`Something went Wrong`)
})
app.listen(8080,()=>{
    console.log(`Listening to port 8080`);
}) 