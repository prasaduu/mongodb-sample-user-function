"use strict";

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(
  "mongodb+srv://dp_mongo:qwerty1234@cluster0.ruwcj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&poolSize=20",
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

async function getExecutedCodeFromRequestBody(requestBody) {
  const stringifiedCode = requestBody["code"];
  let evaluatedCode,
    extractedResult = [],
    finalOutput = " -- ";
  try {
    const { db, client } = await createConnection();
    evaluatedCode = await eval(`(${stringifiedCode})()`);
    console.log("Evaluated Code: ", evaluatedCode);

    await evaluatedCode.forEach((item) => extractedResult.push(item));
    console.log("extracted result: ", extractedResult);

    finalOutput = extractedResult;
    console.log("closing connection");
    await client.close();
  } catch (e) {
    finalOutput = e.message;
  }
  console.log("finalOutput", finalOutput);

  return finalOutput;
}

module.exports.helloWorld = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  console.log("... Start connecting ...");
  const finalOutput = await getExecutedCodeFromRequestBody(requestBody);
  console.log("... Process finished ...", finalOutput);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "response Message",
      input: event,
      output: finalOutput,
      parsedRequestBody: requestBody,
    }),
  };

  callback(null, response);
};
