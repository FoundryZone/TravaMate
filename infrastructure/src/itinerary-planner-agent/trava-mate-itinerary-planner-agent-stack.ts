import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../../base-stack";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib";
import { aws_bedrock as bedrock } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import * as fs from "fs";
import { CfnAgent } from "aws-cdk-lib/aws-bedrock";

export class TravaMateItineraryPlannerAgentStack extends BaseStack {
  public agentCollaborator: CfnAgent.AgentCollaboratorProperty;
  constructor(
    scope: Construct,
    iternaryPlannerLambda: Function,
    bedrockAgentRole: iam.Role,
    id: string,
    props?: MyStackProps
  ) {
    super(scope, id, props);

    const agentInstructions = fs
      .readFileSync(
        "src/itinerary-planner-agent/itinerary-planner-agent-instructions.txt"
      )
      .toString();
    const apipSchema = fs
      .readFileSync(
        "src/itinerary-planner-agent/itinerary-planner-agent-openapi-schema.yml"
      )
      .toString();

    const itineraryPlannerAgent = new bedrock.CfnAgent(
      this,
      `ItineraryPlannerAgent`,
      {
        agentName: `ItineraryPlannerAgent${props?.suffix}`,
        description:
          "This agent will plan itinerary based on the user requirements",
        autoPrepare: true,
        foundationModel: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        agentResourceRoleArn: bedrockAgentRole.roleArn,
        actionGroups: [
          {
            actionGroupName: "ItineraryPlannerAgent",
            description:
              "This action group wll handle all types of itinerary planning.",
            actionGroupExecutor: {
              lambda: iternaryPlannerLambda.functionArn,
            },
            apiSchema: {
              payload: apipSchema,
            },
          },
        ],
        instruction: agentInstructions,
      }
    );

    new CfnOutput(this, "BedrockAgentId", {
      value: itineraryPlannerAgent.ref,
    });

    new CfnOutput(this, "BedrockAgentModelName", {
      value: itineraryPlannerAgent.foundationModel ?? "",
    });

    var agentAlias = new bedrock.CfnAgentAlias(
      this,
      "ItineraryPlannerAgentAlias",
      {
        agentAliasName: `ItineraryPlannerAgentAlias${props?.suffix}`,
        agentId: itineraryPlannerAgent.ref,
      }
    );

    agentAlias.addDependency(itineraryPlannerAgent);

    new CfnOutput(this, "BedrockAgentModelAliasName", {
      value: agentAlias.ref.split("|")[0],
    });
    this.agentCollaborator = {
      agentDescriptor: {
        aliasArn: agentAlias.attrAgentAliasArn,
      },
      collaborationInstruction:
        "This agent will be responsible for planning user travel itinaries.",
      collaboratorName: "ItineraryPlannerAgent",
    };
  }
}
