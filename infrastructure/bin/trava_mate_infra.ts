#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TravaMateBookingAgentStack } from "../src/booking-agent/trava-mate-booking-agent-stack";
import { TravaMateAgentBookingLambdaStack } from "../src/booking-agent/trava-mate-booking-lambda-stack";
import { TravaMateItenaryPlannerLambdaStack } from "../src/itenary-planner-agent/trava-mate-itenary-planner-lambda-stack";
import { TravaMateItenaryPlannerAgentStack } from "../src/itenary-planner-agent/trava-mate-itenary-planner-agent-stack";
import { SupervisorAgentStack } from "../src/supervisor-agent/supervisor-agent-stack";
import { CfnAgent } from "aws-cdk-lib/aws-bedrock";
import { TravaMateCommonStack } from "../src/common/common-stack";

const app = new cdk.App();

const suffixProvided = app.node.tryGetContext("suffix");
const suffix = suffixProvided ? `-${suffixProvided}` : "";
const stackProps = {
  suffix: suffix,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
};

const travaMateCommonStack = new TravaMateCommonStack(
  app,
  `TravaMateCommonStack${suffix}`,
  stackProps
);

const travaMateItenaryPlannerLambdaStack =
  new TravaMateItenaryPlannerLambdaStack(
    app,
    `TravMateItenaryPlannerLambdaStack${suffix}`,
    stackProps
  );

const travaMateItenaryPlannerAgentStack = new TravaMateItenaryPlannerAgentStack(
  app,
  travaMateItenaryPlannerLambdaStack.iternaryPlannerLambda,
  travaMateCommonStack.bedrockAgentRole,
  `TravaMateItenaryPlannerAgentStack${suffix}`,
  stackProps
);

travaMateItenaryPlannerAgentStack.addDependency(
  travaMateItenaryPlannerLambdaStack
);

const travaMateBookingLambdaStack = new TravaMateAgentBookingLambdaStack(
  app,
  `TravMateAgentBookingLambdaStack${suffix}`,
  stackProps
);

const travaMateBookingAgentStack = new TravaMateBookingAgentStack(
  app,
  travaMateBookingLambdaStack.bookingLambda,
  travaMateCommonStack.bedrockAgentRole,
  `TravaMateBookingAgentStack${suffix}`,
  stackProps
);

const agentCollaborators: CfnAgent.AgentCollaboratorProperty[] = [
  travaMateItenaryPlannerAgentStack.agentCollaborator,
  travaMateBookingAgentStack.agentCollaborator,
];

const supervisorAgentStack = new SupervisorAgentStack(
  app,
  agentCollaborators,
  travaMateCommonStack.bedrockAgentRole,
  `SupervisorAgentStack${suffix}`,
  stackProps
);

travaMateBookingAgentStack.addDependency(travaMateBookingLambdaStack);
supervisorAgentStack.addDependency(travaMateItenaryPlannerAgentStack);
supervisorAgentStack.addDependency(travaMateBookingAgentStack);
