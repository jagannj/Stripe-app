const express = require("express");
require("dotenv").config()
const app = express();
const ejs = require("ejs");
const PORT = process.env.PORT||6900;
const path = require("path");
const bp = require("body-parser");
const { config } = require("dotenv");
app.set("view engine","ejs")
app.use(bp.urlencoded({extended:false}))
app.use(bp.json())
const pub_key = process.env.PUBLISHABLE_KEY
const secert_key = process.env.SECRET_KEY
const stripe = require("stripe")(secert_key)
app.get("/",(req,res)=>{
    res.render('Home',{
        key:pub_key
    })
})
app.post("/payment",(req,res)=>{
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name:"Turbo Dev",
        address:{
            line1:"South street Vanarapetta",
            postal_code:'11032',
            city: 'chennai',
            state: 'India'
        }
    }).then((customer)=>{
        return stripe.charges.create({
            amount:300,
            description:"Development Product",
            currency:"USD",
            customer:customer.id
        })
    }).then(charge=>{
        console.log("sucess",charge);
        res.send("Success")
    }).catch(err=>{
        console.log("errr",err);
        res.send(err)
    })
})
 app.listen(PORT,()=>{
    console.log(`Server Running on Port : ${PORT}`);
 })
