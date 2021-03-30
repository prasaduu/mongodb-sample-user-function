"use strict";

const pi = 22 / 7; // Global scope variable

function getExecutedCodeFromRequestBody(requestBody) {
  const stringifiedCode = requestBody["code"];
  const params = requestBody["params"];
  let evaluatedCode = "";

  try {
    if (stringifiedCode.startsWith("function")) {
      evaluatedCode = eval(`(${stringifiedCode})(${params ? params : ""})`);
    } else {
      evaluatedCode = eval(stringifiedCode);
    }
  } catch (e) {
    evaluatedCode = e.message;
  }
  return evaluatedCode;
}

module.exports.helloWorld = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const executedValue = getExecutedCodeFromRequestBody(requestBody);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "response Message",
      input: event,
      output: executedValue,
      parsedRequestBody: requestBody,
    }),
  };

  callback(null, response);
};
