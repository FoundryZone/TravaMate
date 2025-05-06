import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateInfra from "../src/booking-agent/trava-mate-booking-agent-stack";
import * as BookingLambdaInfra from "../src/booking-agent/trava-mate-booking-lambda-stack";

function createAgentStacktemplate() {
  const app = new cdk.App();
  const stackProps = {
    suffix: "",
  };
  const bookingAgentStack =
    new BookingLambdaInfra.TravMateAgentBookingLambdaStack(
      app,
      "TravMateAgentBookingLambdaStack",
      stackProps
    );
  const agentStack = new TravaMateInfra.TravaMateBookingAgentStack(
    app,
    bookingAgentStack.bookingLambda,
    "TravaMateBookingAgentStack",
    stackProps
  );
  return Template.fromStack(agentStack);
}
const agentStacktemplate = createAgentStacktemplate();

test("Agent Role Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::IAM::Role", {
    RoleName: `BookingAgentRole`,
  });
});

test("Agent Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::Agent", {
    AgentName: `HotelBookingAgent`,
  });
});

test("Agent Alias Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::AgentAlias", {
    AgentAliasName: `hotelBookingAgentAlias`,
  });
});
