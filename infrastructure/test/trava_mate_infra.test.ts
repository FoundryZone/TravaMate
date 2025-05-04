import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TravaMateInfra from "../src/trava_mate_booking_agent-stack";

function createTemplate() {
  const app = new cdk.App();
  const stack = new TravaMateInfra.TravaMateInfraStack(app, "MyTestStack", {
    suffix: ""
  });
  return Template.fromStack(stack);
}

test("Secret Created", () => {
  const template = createTemplate();
  template.hasResourceProperties("AWS::SecretsManager::Secret", {
    Name: `MyTestSecret`
  });
});
