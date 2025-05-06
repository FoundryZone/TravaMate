import {
  BedrockAgentInvocationInput,
  BedrockAgentInvocationResponse,
} from "../../../types";

export const handler = async ({
  inputText,
  apiPath,
  httpMethod,
  actionGroup,
  messageVersion,
  parameters,
  sessionAttributes,
  promptSessionAttributes,
}: BedrockAgentInvocationInput): Promise<BedrockAgentInvocationResponse> => {
  let responseText = "{}";
  let httpStatusCode = 200;
  switch (apiPath) {
    case "/greet":
      const name = parameters.find((x) => x.name === "name");
      if (name) {
        responseText = `Hello ${name?.value}`;
        httpStatusCode = 200;
      } else {
        responseText = ` Bad Request - Missing or invalid name parameter`;
        httpStatusCode = 400;
      }
      break;

    default:
      break;
  }

  return {
    messageVersion,
    response: {
      actionGroup,
      apiPath,
      httpMethod,
      httpStatusCode: httpStatusCode,
      responseBody: {
        ["application/json"]: {
          body: JSON.stringify({message: responseText}),
        },
      },
    },
  } as BedrockAgentInvocationResponse;
};
