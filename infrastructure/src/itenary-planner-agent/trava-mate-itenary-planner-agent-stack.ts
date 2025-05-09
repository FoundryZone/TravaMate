import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../../base-stack";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib";
import { aws_bedrock as bedrock } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import * as fs from "fs";

export class TravaMateItenaryPlannerAgentStack extends BaseStack {
  constructor(scope: Construct, iternaryPlannerLambda: Function, id: string, props?: MyStackProps) {
    super(scope, id, props);

    const bedrockAgentRole = new iam.Role(this, "ItenaryPlannerAgentRole", {
      roleName: `ItenaryPlannerAgentRole${props?.suffix}`,
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

    const agentInstructions = fs.readFileSync("src/itenary-planner-agent/itenary-planner-agent-instructions.txt").toString();
    const apipSchema = fs
      .readFileSync("src/itenary-planner-agent/itenary-planner-agent-openapi-schema.yml")
      .toString();

    const itenaryPlannerAgent = new bedrock.CfnAgent(this, `ItenaryPlannerAgent`, {
      agentName: `ItenaryPlannerAgent${props?.suffix}`,
      description:
        "This agent will plan itenary based on the user requirements",
      autoPrepare: true,
      foundationModel: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
      agentResourceRoleArn: bedrockAgentRole.roleArn,
      actionGroups: [
        {
          actionGroupName: "ItenaryPlannerAgent",
          description: "This action group wll handle all types of itenary planning.",
          actionGroupExecutor: {
            lambda: iternaryPlannerLambda.functionArn,
          },
          apiSchema: {
            payload: apipSchema,
          },
        },
      ],
      instruction: agentInstructions,
    });

    new CfnOutput(this, "BedrockAgentId", {
      value: itenaryPlannerAgent.ref,
    });

    new CfnOutput(this, "BedrockAgentModelName", {
      value: itenaryPlannerAgent.foundationModel ?? "",
    });

    const agentAlias = new bedrock.CfnAgentAlias(this, "ItenaryPlannerAgentAlias", {
      agentAliasName: `ItenaryPlannerAgentAlias${props?.suffix}`,
      agentId: itenaryPlannerAgent.ref,
    });

    agentAlias.addDependency(itenaryPlannerAgent);

    new CfnOutput(this, "BedrockAgentModelAliasName", {
      value: agentAlias.ref.split("|")[0],
    });
  }
}