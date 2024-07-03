const Astrologer = require("../model/astrologers");

module.exports.create = async (req, res)=>{
    try {
        const newAstrologer = await Astrologer.create(req.body);
        return res.status(200).json({
            message:"Astrologer created successfully",
            Astrologer: newAstrologer
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error in creating the Astrologer"
        })
    }
}