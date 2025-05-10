import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
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
  return Template.fromStack(commonStack);
}
const agentStacktemplate = createAgentStacktemplate();

test("Agent Role Created", () => {
  agentStacktemplate.hasResourceProperties("AWS::IAM::Role", {
    RoleName: `BookingAgentRole`,
  });
});
