import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../../base-stack";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib";

export class TravaMateCommonStack extends BaseStack {
  public bedrockAgentRole: iam.Role;
  constructor(
    scope: Construct,
    id: string,
    props?: MyStackProps
  ) {
    super(scope, id, props);

    this.bedrockAgentRole = new iam.Role(this, "BookingAgentRole", {
      roleName: `BookingAgentRole${props?.suffix}`,
      assumedBy: new iam.ServicePrincipal("bedrock.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonBedrockFullAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambda_FullAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess"),
      ],
    });

    new CfnOutput(this, "AgentRoleARN", {
      value: this.bedrockAgentRole.roleArn,
    });

    this.bedrockAgentRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelEndpoint",
          "bedrock:InvokeModelEndpointAsync",
          "bedrock:InvokeModelWithResponseStream",
        ],
        resources: ["*"],
      })
    );
  }
}
