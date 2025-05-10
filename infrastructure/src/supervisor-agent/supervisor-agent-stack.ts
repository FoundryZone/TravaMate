import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../../base-stack";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib";
import { aws_bedrock as bedrock } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import * as fs from "fs";

export class SupervisorAgentStack extends BaseStack {
  constructor(
    scope: Construct,
    agentCollaborators: bedrock.CfnAgent.AgentCollaboratorProperty[],
    bedrockAgentRole: iam.Role,
    id: string,
    props?: MyStackProps
  ) {
    super(scope, id, props);

    const agentInstructions = fs
      .readFileSync("src/supervisor-agent/agent-instructions.txt")
      .toString();

    const itenaryPlannerAgent = new bedrock.CfnAgent(
      this,
      `ItenaryPlannerAgent`,
      {
        agentName: `SupervisorAgent${props?.suffix}`,
        description: "This agent will supervise the bookings and planning.",
        autoPrepare: true,
        foundationModel: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        agentResourceRoleArn: bedrockAgentRole.roleArn,
        instruction: agentInstructions,
        agentCollaboration: "SUPERVISOR",
        agentCollaborators: agentCollaborators,
      }
    );

    new CfnOutput(this, "BedrockAgentId", {
      value: itenaryPlannerAgent.ref,
    });

    new CfnOutput(this, "BedrockAgentModelName", {
      value: itenaryPlannerAgent.foundationModel ?? "",
    });

    const agentAlias = new bedrock.CfnAgentAlias(this, "SupervisorAgentAlias", {
      agentAliasName: `SupervisorAgentAlias${props?.suffix}`,
      agentId: itenaryPlannerAgent.ref,
    });

    agentAlias.addDependency(itenaryPlannerAgent);

    new CfnOutput(this, "BedrockAgentModelAliasName", {
      value: agentAlias.ref.split("|")[0],
    });
  }
}
