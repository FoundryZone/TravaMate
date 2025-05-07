import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as ItenaryPlannerLambdaInfra from "../../src/itenary-planner-agent/trava-mate-itenary-planner-lambda-stack";

function createAgentLambdatemplate() {
  const app = new cdk.App();
  const stackProps = {
    suffix: "",
  };
  const itenaryPlannerAgentLambdaStack =
    new ItenaryPlannerLambdaInfra.TravaMateItenaryPlannerLambdaStack(
      app,
      "TravMateItenaryPlannerLambdaStack",
      stackProps
    );
  return Template.fromStack(itenaryPlannerAgentLambdaStack);
}
const agentLambdaStackTemplate = createAgentLambdatemplate();

test("Itenary planner agent lambda created", () => {
  agentLambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: `ItenaryPlannerLambda`,
  });
});
