const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    allocatedAstrologer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Astrologer"
    }
},{
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;