import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateItineraryPlannerAgentInfra from "../../src/itinerary-planner-agent/trava-mate-itinerary-planner-agent-stack";
import * as TravaMateItineraryPlannerLambdaInfra from "../../src/itinerary-planner-agent/trava-mate-itinerary-planner-lambda-stack";
import { TravaMateCommonStack } from "../../src/common/common-stack";

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

  const agentStack =
    new TravaMateItineraryPlannerAgentInfra.TravaMateItineraryPlannerAgentStack(
      app,
      itineraryPlannerLambdaStack.iternaryPlannerLambda,
      commonStack.bedrockAgentRole,
      "TravaMateItineraryPlannerAgentStack",
      stackProps
    );
  return Template.fromStack(agentStack);
}

const agentStacktemplate = createAgentStacktemplate();

test("Agent Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::Agent", {
    AgentName: `ItineraryPlannerAgent`,
  });
});

test("Agent Alias Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::AgentAlias", {
    AgentAliasName: `ItineraryPlannerAgentAlias`,
  });
});
