const User = require("../model/user");
const { allocateToAstrologer, adjustFlowForTopAstrologers } = require("../services/flowDistribution");

module.exports.allocateUser = async (req, res)=>{
    const users = await User.find({allocatedAstrologer: null});
    const allocated = await allocateToAstrologer(users);
    return res.status(200).json({
        message: "Users allocated to astrologers successfully.",
        allocated
    });
}

module.exports.adjustFlow = async (req, res) => {
    const { adjustment } = req.body;
  
    // Validate adjustment value
    if (typeof adjustment !== 'number' || isNaN(adjustment)) {
      return res.status(400).json({
        message: 'Invalid adjustment value. It must be a number.'
      });
    }
  
    try {
      const adjust = await adjustFlowForTopAstrologers(adjustment);
      return res.status(200).json({
        message: 'Flow adjusted for top astrologers successfully!',
        adjust
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An error occurred while adjusting the flow.',
        error: error.message
      });
    }
  };
  