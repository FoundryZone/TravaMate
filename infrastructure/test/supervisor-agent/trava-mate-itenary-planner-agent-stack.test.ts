import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateItenaryPlannerAgentInfra from "../../src/itenary-planner-agent/trava-mate-itenary-planner-agent-stack";
import * as TravaMateItenaryPlannerLambdaInfra from "../../src/itenary-planner-agent/trava-mate-itenary-planner-lambda-stack";
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

  const itenaryPlannerLambdaStack =
    new TravaMateItenaryPlannerLambdaInfra.TravaMateItenaryPlannerLambdaStack(
      app,
      "TravMateItenaryPlannerLambdaStack",
      stackProps
    );

  const itenaryPlannerAgentStack =
    new TravaMateItenaryPlannerAgentInfra.TravaMateItenaryPlannerAgentStack(
      app,
      itenaryPlannerLambdaStack.iternaryPlannerLambda,
      commonStack.bedrockAgentRole,
      "TravaMateItenaryPlannerAgentStack",
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
    itenaryPlannerAgentStack.agentCollaborator,
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
