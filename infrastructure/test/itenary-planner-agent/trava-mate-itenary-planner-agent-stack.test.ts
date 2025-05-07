import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateItenaryPlannerAgentInfra from "../../src/Itenary-planner-agent/trava-mate-itenary-planner-agent-stack";
import * as TravaMateItenaryPlannerLambdaInfra from "../../src/Itenary-planner-agent/trava-mate-itenary-planner-lambda-stack";

function createAgentStacktemplate() {
  const app = new cdk.App();
  const stackProps = {suffix: ""};
  const itenaryPlannerLambdaStack = new TravaMateItenaryPlannerLambdaInfra.TravaMateItenaryPlannerLambdaStack(
      app,
      "TravMateItenaryPlannerLambdaStack",
      stackProps
    );

  const agentStack = new TravaMateItenaryPlannerAgentInfra.TravaMateItenaryPlannerAgentStack(
    app,
    itenaryPlannerLambdaStack.iternaryPlannerLambda,
    "TravaMateItenaryPlannerAgentStack",
    stackProps
  );
  return Template.fromStack(agentStack);
}

const agentStacktemplate = createAgentStacktemplate();

test("Agent Role Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::IAM::Role", {
    RoleName: `ItenaryPlannerAgentRole`,
  });
});

test("Agent Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::Agent", {
    AgentName: `ItenaryPlannerAgent`,
  });
});

test("Agent Alias Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::Bedrock::AgentAlias", {
    AgentAliasName: `ItenaryPlannerAgentAlias`,
  });
});
