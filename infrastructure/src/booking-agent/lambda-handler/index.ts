import {
  BedrockAgentInvocationInput,
  BedrockAgentInvocationResponse,
} from "../../types";

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
    case "/book-hotel":
      const hotelName = parameters.find((x) => x.name === "hotelName");
      const bookingDate = parameters.find((x) => x.name === "bookingDate");
      if (hotelName && bookingDate) {
        responseText = `Booking successful with id - 1076`;
        httpStatusCode = 200;
      } else {
        responseText = ` Bad Request - Missing or invalid hotelName or bookingDate parameter`;
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
