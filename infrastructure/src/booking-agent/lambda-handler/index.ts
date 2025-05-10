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
      const bookingDatte = parameters.find((x) => x.name === "bookingDatte");
      if (hotelName && bookingDatte) {
        responseText = `Booking successful with id - 1076`;
        httpStatusCode = 200;
      } else {
        responseText = ` Bad Request - Missing or invalid hotelName or bookingDatte parameter`;
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
