import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateItineraryPlannerAgentInfra from "../../src/itinerary-planner-agent/trava-mate-itinerary-planner-agent-stack";
import * as TravaMateItineraryPlannerLambdaInfra from "../../src/itinerary-planner-agent/trava-mate-itinerary-planner-lambda-stack";
import * as TravaMateInfra from "../../src/booking-agent/trava-mate-booking-agent-stack";
import * as BookingLambdaInfra from "../../src/booking-agent/trava-mate-booking-lambda-stack";
import { TravaMateCommonStack } from "../../src/common/common-stack";
import { SupervisorAgentStack } from "../../src/supervisor-agent/supervisor-agent-stack";
import { CfnAgent } from "aws-cdk-lib/aws-bedrock";

function createAgentStacktemplate() {
  const app = new cdk.App();
  const stackProps = { suffix: "" };
  const commonStack = new TravaMateCommonStack(
    app,
    `TravaMateCommonStack`,
    stackProps
  );

  const itineraryPlannerLambdaStack =
    new TravaMateItineraryPlannerLambdaInfra.TravaMateItineraryPlannerLambdaStack(
      app,
      "TravMateItineraryPlannerLambdaStack",
      stackProps
    );

  const itineraryPlannerAgentStack =
    new TravaMateItineraryPlannerAgentInfra.TravaMateItineraryPlannerAgentStack(
      app,
      itineraryPlannerLambdaStack.iternaryPlannerLambda,
      commonStack.bedrockAgentRole,
      "TravaMateItineraryPlannerAgentStack",
      stackProps
    );

  const bookingAgentLambdaStack =
    new BookingLambdaInfra.TravaMateAgentBookingLambdaStack(
      app,
      "TravMateAgentBookingLambdaStack",
      stackProps
    );
  const bookingAgenStack = new TravaMateInfra.TravaMateBookingAgentStack(
    app,
    bookingAgentLambdaStack.bookingLambda,
    commonStack.bedrockAgentRole,
    "TravaMateBookingAgentStack",
    stackProps
  );

  const agentCollaborators: CfnAgent.AgentCollaboratorProperty[] = [
    itineraryPlannerAgentStack.agentCollaborator,
    bookingAgenStack.agentCollaborator,
  ];

  const supervisorAgentStack = new SupervisorAgentStack(
    app,
    agentCollaborators,
    commonStack.bedrockAgentRole,
    `SupervisorAgentStack`,
    stackProps
  );

  return Template.fromStack(supervisorAgentStack);
}

const agentStacktemplate = createAgentStacktemplate();

test("Agent Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::Agent", {
    AgentName: `SupervisorAgent`,
  });
});

test("Agent Alias Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::AgentAlias", {
    AgentAliasName: `SupervisorAgentAlias`,
  });
});
