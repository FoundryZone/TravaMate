import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateInfra from "../src/booking-agent/trava-mate-booking-agent-stack";
import * as BookingLambdaInfra from "../src/booking-agent/trava-mate-booking-lambda-stack";

function createAgentLambdatemplate() {
  const app = new cdk.App();
  const stackProps = {
    suffix: "",
  };
  const bookingAgentLambdaStack =
    new BookingLambdaInfra.TravMateAgentBookingLambdaStack(
      app,
      "TravMateAgentBookingLambdaStack",
      stackProps
    );
  return Template.fromStack(bookingAgentLambdaStack);
}
const agentLambdaStackTemplate = createAgentLambdatemplate();

test("Agent Lambda Created", () => {
  agentLambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: `BookingLambda`,
  });
});
