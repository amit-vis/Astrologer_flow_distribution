const mongoose = require("mongoose");

const astrologersSchema = new mongoose.Schema({
    name:{
        type: String
    },
    totalConnection:{
        type: Number,
        default: 0
    },
    isTopAstrologer:{
        type: Boolean,
        default: false
    },
    maxConnection:{
        type:Number,
        default: 5
    }
},{
    timestamps: true
});

const Astrologer = mongoose.model("Astrologer", astrologersSchema);
module.exports = Astrologer;