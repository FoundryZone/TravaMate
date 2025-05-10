import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateInfra from "../../src/booking-agent/trava-mate-booking-agent-stack";
import * as BookingLambdaInfra from "../../src/booking-agent/trava-mate-booking-lambda-stack";
import { TravaMateCommonStack } from "../../src/common/common-stack";

function createAgentStacktemplate() {
  const app = new cdk.App();
  const stackProps = {
    suffix: "",
  };
  const commonStack = new TravaMateCommonStack(
    app,
    `TravaMateCommonStack`,
    stackProps
  );
  const bookingAgentStack =
    new BookingLambdaInfra.TravaMateAgentBookingLambdaStack(
      app,
      "TravMateAgentBookingLambdaStack",
      stackProps
    );
  const agentStack = new TravaMateInfra.TravaMateBookingAgentStack(
    app,
    bookingAgentStack.bookingLambda,
    commonStack.bedrockAgentRole,
    "TravaMateBookingAgentStack",
    stackProps
  );
  return Template.fromStack(agentStack);
}
const agentStacktemplate = createAgentStacktemplate();

test("Agent Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::Agent", {
    AgentName: `HotelBookingAgent`,
  });
});

test("Agent Alias Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::AgentAlias", {
    AgentAliasName: `HotelBookingAgentAlias`,
  });
});
