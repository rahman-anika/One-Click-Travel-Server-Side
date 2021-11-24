const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcqim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const port = process.env.PORT || 5000;
const app = express();



app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.send("Hello world!");
});


client.connect((err) => {
    const toursCollection = client.db("travelDb").collection("tours");
    const bookingsCollection = client.db("travelDb").collection("bookings");



    // Get all services from database 

    app.get("/services", async (req, res) => {

        const result = await toursCollection.find({}).toArray();
        res.send(result);

    });




    // Add new tour package and store it into database 

    app.post("/addPackage", (req, res) => {
        console.log(req.body);
        toursCollection.insertOne(req.body).then((documents) => {
            res.send(documents.insertedId);
        });
    });





    // Add booking and store it into database 

    app.post("/addOrders", (req, res) => {
        bookingsCollection.insertOne(req.body).then((result) => {
            res.send(result);
        });
    });




    //   Find all bookings/orders from database 

    app.get("/allBookings", async (req, res) => {

        const result = await bookingsCollection.find({}).toArray();
        res.send(result);

    });





    // Delete booking/order from database 

    app.delete("/deleteOrder/:id", async (req, res) => {
        console.log(req.params.id);

        const result = await bookingsCollection
            .deleteOne({ _id: ObjectId(req.params.id) });

        res.send(result);

    });




    // Find single booking/order from database through id 

    app.get("/singleBooking/:id", async (req, res) => {
        console.log(req.params.id);


        bookingsCollection
            .findOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
                res.send(result);

            });


    });





    //    Update status for booking/order 

    app.put("/update/:id", async (req, res) => {
        const id = req.params.id;
        const updatedInfo = req.body;
        const filter = { _id: ObjectId(id) };


        const result = await bookingsCollection
            .updateOne(filter, {
                $set: {
                    // status: updatedInfo.status
                    status: 'Approved',

                },
            });
        console.log(result);
        res.send(result);

    });



    // Get all orders/bookings by email query from database 

    app.get("/myOrders/:email", async (req, res) => {
        console.log(req.params);


        const result = await bookingsCollection
            .find({ email: req.params.email })
            .toArray();
        // console.log(result);
        res.send(result);



    });


    // client.close(); 


});

app.listen(port, (req, res) => {
    console.log('Listening at the port at ', port);

});