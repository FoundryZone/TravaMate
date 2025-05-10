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

const commonStack = new TravaMateCommonStack(
  app,
  `TravaMateCommonStack${suffix}`,
  stackProps
);

const itenaryPlannerLambdaStack =
  new TravaMateItenaryPlannerLambdaStack(
    app,
    `TravMateItenaryPlannerLambdaStack${suffix}`,
    stackProps
  );

const itenaryPlannerAgentStack = new TravaMateItenaryPlannerAgentStack(
  app,
  itenaryPlannerLambdaStack.iternaryPlannerLambda,
  commonStack.bedrockAgentRole,
  `TravaMateItenaryPlannerAgentStack${suffix}`,
  stackProps
);

const bookingLambdaStack = new TravaMateAgentBookingLambdaStack(
  app,
  `TravMateAgentBookingLambdaStack${suffix}`,
  stackProps
);

const bookingAgentStack = new TravaMateBookingAgentStack(
  app,
  bookingLambdaStack.bookingLambda,
  commonStack.bedrockAgentRole,
  `TravaMateBookingAgentStack${suffix}`,
  stackProps
);

const agentCollaborators: CfnAgent.AgentCollaboratorProperty[] = [
  itenaryPlannerAgentStack.agentCollaborator,
  bookingAgentStack.agentCollaborator,
];

const supervisorAgentStack = new SupervisorAgentStack(
  app,
  agentCollaborators,
  commonStack.bedrockAgentRole,
  `SupervisorAgentStack${suffix}`,
  stackProps
);

itenaryPlannerAgentStack.addDependency(commonStack);
bookingAgentStack.addDependency(commonStack);
supervisorAgentStack.addDependency(commonStack);

bookingAgentStack.addDependency(bookingLambdaStack);
itenaryPlannerAgentStack.addDependency(itenaryPlannerLambdaStack);
supervisorAgentStack.addDependency(itenaryPlannerAgentStack);
supervisorAgentStack.addDependency(bookingAgentStack);
