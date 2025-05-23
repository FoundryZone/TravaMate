import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../../base-stack";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib";
import { aws_bedrock as bedrock } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import * as fs from "fs";
import { CfnAgent } from "aws-cdk-lib/aws-bedrock";

export class TravaMateBookingAgentStack extends BaseStack {
  public agentCollaborator: CfnAgent.AgentCollaboratorProperty;
  constructor(
    scope: Construct,
    bookingLambda: Function,
    bedrockAgentRole: iam.Role,
    id: string,
    props?: MyStackProps
  ) {
    super(scope, id, props);

    const agentInstructions = fs
      .readFileSync("src/booking-agent/instructions.txt")
      .toString();
    const apipSchema = fs
      .readFileSync("src/booking-agent/booking-agent-openapi-schema.yml")
      .toString();

    const bookingAgent = new bedrock.CfnAgent(this, `HotelBookingAgent`, {
      agentName: `HotelBookingAgent${props?.suffix}`,
      description:
        "This agent will book hotel accomodations and travel tickets",
      autoPrepare: true,
      foundationModel: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
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

    var agentAlias = new bedrock.CfnAgentAlias(this, "BookingAgentAlias", {
      agentAliasName: `HotelBookingAgentAlias${props?.suffix}`,
      agentId: bookingAgent.ref,
    });

    agentAlias.addDependency(bookingAgent);

    new CfnOutput(this, "BedrockAgentModelAliasName", {
      value: agentAlias.ref.split("|")[0],
    });

    this.agentCollaborator = {
      agentDescriptor: {
        aliasArn: agentAlias.attrAgentAliasArn,
      },
      collaborationInstruction:
        "This agent will be responsible for booking any type of bookings like hotel, travel, etc.",
      collaboratorName: "BookingAgent",
    };
  }
}
