const User = require("../model/user");

module.exports.create = async (req, res)=>{
    try {
        const newUser = await User.create(req.body);
        return res.status(200).json({
            message: "User registered!",
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error in creating the User"
        })
    }
}