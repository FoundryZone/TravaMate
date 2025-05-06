import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../../base-stack";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib";
import { aws_bedrock as bedrock } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import * as fs from "fs";

export class TravaMateBookingAgentStack extends BaseStack {
  constructor(
    scope: Construct,
    bookingLambda: Function,
    id: string,
    props?: MyStackProps
  ) {
    super(scope, id, props);

    const bedrockAgentRole = new iam.Role(this, "BookingAgentRole", {
      roleName: `BookingAgentRole${props?.suffix}`,
      assumedBy: new iam.ServicePrincipal("bedrock.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonBedrockFullAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambda_FullAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess"),
      ],
    });

    new CfnOutput(this, "AgentRoleARN", {
      value: bedrockAgentRole.roleArn,
    });

    bedrockAgentRole.addToPolicy(
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

    const agentInstructions = fs.readFileSync("src/booking-agent/instructions.txt").toString();
    const apipSchema = fs
      .readFileSync("src/booking-agent/booking-agent-openapi-schema.yml")
      .toString();

    const bookingAgent = new bedrock.CfnAgent(this, `HotelBookingAgent`, {
      agentName: `HotelBookingAgent${props?.suffix}`,
      description:
        "This agent will book hotel accomodations and travel tickets",
      autoPrepare: true,
      foundationModel: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      agentResourceRoleArn: bedrockAgentRole.roleArn,
      actionGroups: [
        {
          actionGroupName: "HotelBookingAgent",
          description: "This action group wll handle all types of bookings.",
          actionGroupExecutor: {
            lambda: bookingLambda.functionArn,
          },
          apiSchema: {
            payload: apipSchema,
          },
        },
      ],
      instruction: agentInstructions,
    });

    new CfnOutput(this, "BedrockAgentId", {
      value: bookingAgent.ref,
    });

    new CfnOutput(this, "BedrockAgentModelName", {
      value: bookingAgent.foundationModel ?? "",
    });

    const agentAlias = new bedrock.CfnAgentAlias(this, "BookingAgentAlias", {
      agentAliasName: `HotelBookingAgentAlias${props?.suffix}`,
      agentId: bookingAgent.ref,
    });

    agentAlias.addDependency(bookingAgent);

    new CfnOutput(this, "BedrockAgentModelAliasName", {
      value: agentAlias.ref.split("|")[0],
    });
  }
}
