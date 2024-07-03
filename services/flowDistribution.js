const User = require("../model/user");
const Astrologer = require("../model/astrologers");

module.exports.allocateToAstrologer = async (users) => {
  const astrologers = await Astrologer.find();

  for (let user of users) {
    user = await User.findById(user._id); // Ensure user is a Mongoose model instance
    let allocated = false;
    for (let astrologer of astrologers) {
      console.log(`Checking astrologer ${astrologer._id} with ${astrologer.totalConnection}/${astrologer.maxConnection} connections.`);
      if (astrologer.totalConnection < astrologer.maxConnection) {
        user.allocatedAstrologer = astrologer._id;
        astrologer.totalConnection++;
        await user.save();
        await astrologer.save();
        allocated = true;
        console.log(`Allocated user ${user._id} to astrologer ${astrologer._id}.`);
        break; // Exit the loop once the user is allocated
      }
    }
    if (!allocated) {
      // Handle case where no astrologer is available
      user.allocatedAstrologer = null;
      await user.save();
      console.log(`No available astrologers for user ${user._id}.`);
    }
  }
};

module.exports.adjustFlowForTopAstrologers = async (adjustment) => {
  const topAstrologers = await Astrologer.find({ isTopAstrologer: true });

  for (const astrologer of topAstrologers) {
    let newMaxConnections = astrologer.maxConnection + adjustment;

    // Cap the newMaxConnections at 10
    if (newMaxConnections > 10) {
      newMaxConnections = 10;
    }

    // Ensure newMaxConnections is a valid number and greater than or equal to 0
    if (typeof newMaxConnections !== 'number' || isNaN(newMaxConnections) || newMaxConnections < 0) {
      throw new Error(`Invalid maxConnections value for astrologer ${astrologer.name}`);
    }

    astrologer.maxConnection = newMaxConnections;
    await astrologer.save();
  }

  return topAstrologers;
}
