#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TravaMateBookingAgentStack } from "../src/booking-agent/trava-mate-booking-agent-stack";
import { TravaMateAgentBookingLambdaStack } from "../src/booking-agent/trava-mate-booking-lambda-stack";
import { TravaMateItenaryPlannerLambdaStack } from "../src/Itenary-planner-agent/trava-mate-itenary-planner-lambda-stack";
import { TravaMateItenaryPlannerAgentStack } from "../src/Itenary-planner-agent/trava-mate-itenary-planner-agent-stack";

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

const travaMateItenaryPlannerLambdaStack = new TravaMateItenaryPlannerLambdaStack(
  app,
  `TravMateItenaryPlannerLambdaStack${suffix}`,
  stackProps
);

const travaMateItenaryPlannerAgentStack =  new TravaMateItenaryPlannerAgentStack(
  app,
  travaMateItenaryPlannerLambdaStack.iternaryPlannerLambda,
  `TravaMateItenaryPlannerAgentStack${suffix}`,
  stackProps
);

travaMateItenaryPlannerAgentStack.addDependency(travaMateItenaryPlannerLambdaStack);

const travaMateBookingLambdaStack = new TravaMateAgentBookingLambdaStack(
  app,
  `TravMateAgentBookingLambdaStack${suffix}`,
  stackProps
);

const travaMateBookingAgentStack =  new TravaMateBookingAgentStack(
  app,
  travaMateBookingLambdaStack.bookingLambda,
  `TravaMateBookingAgentStack${suffix}`,
  stackProps
);

travaMateBookingAgentStack.addDependency(travaMateBookingLambdaStack);