import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as ItineraryPlannerLambdaInfra from "../../src/itinerary-planner-agent/trava-mate-itinerary-planner-lambda-stack";

function createAgentLambdatemplate() {
  const app = new cdk.App();
  const stackProps = {
    suffix: "",
  };
  const itineraryPlannerAgentLambdaStack =
    new ItineraryPlannerLambdaInfra.TravaMateItineraryPlannerLambdaStack(
      app,
      "TravMateItineraryPlannerLambdaStack",
      stackProps
    );
  return Template.fromStack(itineraryPlannerAgentLambdaStack);
}
const agentLambdaStackTemplate = createAgentLambdatemplate();

test("Itinerary planner agent lambda created", () => {
  agentLambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: `ItineraryPlannerLambda`,
  });
});
