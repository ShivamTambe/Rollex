const express = require('express');
const fetch = require('node-fetch');
const app = express();
const ejs = require("ejs")
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require("path");

const PORT = 3000;

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json());



app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

dotenv.config();
mongoose.connect(process.env.MongoConnect, { useNewUrlParser: true });
const dataSchema = {
    id:Number,
    title:String,
    price:String,
    discription:String,
    category:String,
    sixth:String,
    image:String,
    sold:Boolean,
    dataOfSale:Date
};
const dataInfo = mongoose.model("dataInfo", dataSchema);

app.get('/', (req, res) => {
    // fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
    //   .then(response => response.json())
    // .then(data => {
    //     data.forEach(element => {
    //         console.log(element.id);
    //         let database = new dataInfo({
    //             id:element.id,
    //             title:element.title,
    //             price:String(element.price),
    //             discription:element.description,
    //             category:element.category,
    //             image:element.image,
    //             sold:element.sold,
    //             dataOfSale:element.dateOfSale
    //         })
    //         database.save();
    //     });
    dataInfo.find().then(result => {
        res.render("index", {data:result});
    }).catch(err => console.log(err));
    // }) .catch(error => {
    //     console.error(error);
    // })
});

app.get('/stat', (req, res) => {
    dataInfo.find().then(result => {
        // res.send(result);
        let obj=[];
        let abc=0;
        result.forEach(element => {
            let a =JSON.stringify(element.dataOfSale);
            abc++;
            // console.log(a.substring(6,8));

            if(a.substring(6,8)=="11"){
                obj.push(element);
            }
        });
        console.log(abc);
        res.render("statistic", {data:obj,sold:"-",total:"-",notSold:"-"});
    }).catch(err => console.log(err));
})



app.post("/stats",function(req,res){
    let month=req.body.month;
    console.log(month);
    let total=0;
    let sold=0;
    let notsold;
    dataInfo.find().then(result => {
        let obj=[];
        let abc=0;
        result.forEach(element => {
            let a =JSON.stringify(element.dataOfSale);
            // console.log(a.substring(6,8));
            abc++;
            if(a.substring(6,8)==month){
                obj.push(element);
                if(element.sold==true){
                    sold++;
                    total=total+parseFloat(element.price.replace(/,/g, ''));
                }
            }
        });
        
        notsold=obj.length - sold;
        console.log("avx"+abc);
        res.render("statistic", {data:obj,sold:sold,total:total,notSold:notsold});
    }).catch(err => console.log(err));
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
