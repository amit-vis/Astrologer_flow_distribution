const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Astrologer = require('../model/astrologers');
const { adjustFlowForTopAstrologers } = require('../services/flowDistribution');
const { adjustFlow } = require('../controller/flowDistributionalgo_controller'); // Assuming this is the path to the controller

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

test('should adjust flow for top astrologers correctly', async () => {
  const astrologers = [
    new Astrologer({ _id: new mongoose.Types.ObjectId(), isTopAstrologer: true, maxConnection: 5 }),
    new Astrologer({ _id: new mongoose.Types.ObjectId(), isTopAstrologer: true, maxConnection: 8 }),
    new Astrologer({ _id: new mongoose.Types.ObjectId(), isTopAstrologer: false, maxConnection: 7 }),
  ];

  await Astrologer.insertMany(astrologers);

  const adjustment = 3;
  const adjustedAstrologers = await adjustFlowForTopAstrologers(adjustment);

  const updatedAstrologers = await Astrologer.find({ isTopAstrologer: true });

  expect(updatedAstrologers[0].maxConnection).toBe(8); // 5 + 3
  expect(updatedAstrologers[1].maxConnection).toBe(10); // 8 + 3 capped at 10
  expect(adjustedAstrologers.length).toBe(2);
});

test('should return error if adjustment value is invalid', async () => {
  const req = {
    body: { adjustment: 'invalid' }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await adjustFlow(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Invalid adjustment value. It must be a number.'
  });
});

test('should adjust flow and respond with success message', async () => {
  const astrologers = [
    new Astrologer({ _id: new mongoose.Types.ObjectId(), isTopAstrologer: true, maxConnection: 5 }),
    new Astrologer({ _id: new mongoose.Types.ObjectId(), isTopAstrologer: true, maxConnection: 8 }),
  ];

  await Astrologer.insertMany(astrologers);

  const req = {
    body: { adjustment: 2 }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await adjustFlow(req, res);

  const updatedAstrologers = await Astrologer.find({ isTopAstrologer: true });

  expect(updatedAstrologers[0].maxConnection).toBe(7); // 5 + 2
  expect(updatedAstrologers[1].maxConnection).toBe(10); // 8 + 2 capped at 10

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Flow adjusted for top astrologers successfully!',
    adjust: expect.any(Array)
  });
});

test('should return error if there is an error during adjustment', async () => {
  const req = {
    body: { adjustment: 2 }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  jest.spyOn(Astrologer, 'find').mockImplementationOnce(() => {
    throw new Error('Test error');
  });

  await adjustFlow(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'An error occurred while adjusting the flow.',
    error: 'Test error'
  });
});
