#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TravaMateBookingAgentStack } from "../src/booking-agent/trava-mate-booking-agent-stack";
import { TravaMateAgentBookingLambdaStack } from "../src/booking-agent/trava-mate-booking-lambda-stack";
import { TravaMateItineraryPlannerLambdaStack } from "../src/itinerary-planner-agent/trava-mate-itinerary-planner-lambda-stack";
import { TravaMateItineraryPlannerAgentStack } from "../src/itinerary-planner-agent/trava-mate-itinerary-planner-agent-stack";
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

const itineraryPlannerLambdaStack =
  new TravaMateItineraryPlannerLambdaStack(
    app,
    `TravMateItineraryPlannerLambdaStack${suffix}`,
    stackProps
  );

const itineraryPlannerAgentStack = new TravaMateItineraryPlannerAgentStack(
  app,
  itineraryPlannerLambdaStack.iternaryPlannerLambda,
  commonStack.bedrockAgentRole,
  `TravaMateItineraryPlannerAgentStack${suffix}`,
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
  itineraryPlannerAgentStack.agentCollaborator,
  bookingAgentStack.agentCollaborator,
];

const supervisorAgentStack = new SupervisorAgentStack(
  app,
  agentCollaborators,
  commonStack.bedrockAgentRole,
  `SupervisorAgentStack${suffix}`,
  stackProps
);

itineraryPlannerAgentStack.addDependency(commonStack);
bookingAgentStack.addDependency(commonStack);
supervisorAgentStack.addDependency(commonStack);

bookingAgentStack.addDependency(bookingLambdaStack);
itineraryPlannerAgentStack.addDependency(itineraryPlannerLambdaStack);
supervisorAgentStack.addDependency(itineraryPlannerAgentStack);
supervisorAgentStack.addDependency(bookingAgentStack);
