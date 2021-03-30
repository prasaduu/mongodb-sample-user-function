const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(
  "mongodb+srv://dp_mongo:qwerty1234@cluster0.ruwcj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 300000000,
    keepAlive: 1,
  }
);

const createConnection = async () => {
  const connectionPromise = new Promise(async (resolve, reject) => {
    console.log("client: ", client);
    await client.connect(async (err) => {
      const db = await client.db("database");
      console.log("db: ", db);
      console.log("Successfully Connected");
      resolve({ db: db, client: client });
      if (err != null) {
        reject("Failed to connect");
      }
    });
  });
  return connectionPromise;
};

async function sampleUserFunction(db) {
  try {
    await db.collection("sales").drop();
  } catch (e) {
    console.log(e.message);
  }
  await db.collection("sales").insertMany([
    {
      _id: 1,
      item: "abc",
      price: 10,
      quantity: 2,
      date: new Date("2014-03-01T08:00:00Z"),
    },
    {
      _id: 2,
      item: "jkl",
      price: 20,
      quantity: 1,
      date: new Date("2014-03-01T09:00:00Z"),
    },
    {
      _id: 3,
      item: "xyz",
      price: 5,
      quantity: 10,
      date: new Date("2014-03-15T09:00:00Z"),
    },
    {
      _id: 4,
      item: "xyz",
      price: 5,
      quantity: 20,
      date: new Date("2014-04-04T11:21:39.736Z"),
    },
    {
      _id: 5,
      item: "abc",
      price: 10,
      quantity: 10,
      date: new Date("2014-04-04T21:23:13.331Z"),
    },
    {
      _id: 6,
      item: "def",
      price: 7.5,
      quantity: 5,
      date: new Date("2015-06-04T05:08:13Z"),
    },
    {
      _id: 7,
      item: "def",
      price: 7.5,
      quantity: 10,
      date: new Date("2015-09-10T08:43:00Z"),
    },
    {
      _id: 8,
      item: "abc",
      price: 10,
      quantity: 5,
      date: new Date("2016-02-06T20:20:13Z"),
    },
  ]);
  await db.collection("sales").find({
    date: { $gte: new Date("2014-04-04"), $lt: new Date("2014-04-05") },
  });
  const aggregation = [
    {
      $match: {
        date: { $gte: new Date("2014-01-01"), $lt: new Date("2015-01-01") },
      },
    },
    {
      $group: {
        _id: "$item",
        totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
      },
    },
  ];
  return await db.collection("sales").aggregate(aggregation);
}

async function main() {
  try {
    const { db, client } = await createConnection();
    console.log("db:", db, "client: ", client);
    const result = await sampleUserFunction(db);
    const extractedResult = []; //Array.from(result);
    await result.forEach((item) => {
      extractedResult.push(item);
    });

    console.log("extractedResult: ", extractedResult);
    await client.close();
    return extractedResult;
  } catch (err) {
    console.log(err);
  }
}

if (require.main === module) {
  main();
}
