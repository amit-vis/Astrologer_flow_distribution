const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.mongoURL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error in connecting to database!"));

db.once("open", ()=>{
    console.log("database successfully connected!")
})

module.exports = db;