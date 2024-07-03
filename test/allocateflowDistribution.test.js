const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../model/user');
const Astrologer = require('../model/astrologers');
const { allocateToAstrologer } = require('../services/flowDistribution');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

test('should allocate users to astrologers with available connections', async () => {
  const astrologers = [
    { _id: new mongoose.Types.ObjectId(), totalConnection: 0, maxConnection: 2 },
    { _id: new mongoose.Types.ObjectId(), totalConnection: 1, maxConnection: 3 },
  ];
  const users = [
    new User({ _id: new mongoose.Types.ObjectId(), allocatedAstrologer: null }),
    new User({ _id: new mongoose.Types.ObjectId(), allocatedAstrologer: null }),
    new User({ _id: new mongoose.Types.ObjectId(), allocatedAstrologer: null }),
  ];

  await Astrologer.insertMany(astrologers);
  await User.insertMany(users);

  await allocateToAstrologer(users);

  const updatedUsers = await User.find({});
  const updatedAstrologers = await Astrologer.find({});

  expect(updatedUsers[0].allocatedAstrologer.toString()).toBe(astrologers[0]._id.toString());
  expect(updatedUsers[1].allocatedAstrologer.toString()).toBe(astrologers[0]._id.toString());
  expect(updatedUsers[2].allocatedAstrologer.toString()).toBe(astrologers[1]._id.toString());

  expect(updatedAstrologers[0].totalConnection).toBe(2);
  expect(updatedAstrologers[1].totalConnection).toBe(2);
});

test('should handle cases where no astrologer is available', async () => {
  const astrologers = [
    { _id: new mongoose.Types.ObjectId(), totalConnection: 2, maxConnection: 2 },
  ];
  const users = [
    new User({ _id: new mongoose.Types.ObjectId(), allocatedAstrologer: null }),
  ];

  await Astrologer.insertMany(astrologers);
  await User.insertMany(users);

  await allocateToAstrologer(users);

  const updatedUsers = await User.find();

  expect(updatedUsers[0].allocatedAstrologer).toBeNull();
});
