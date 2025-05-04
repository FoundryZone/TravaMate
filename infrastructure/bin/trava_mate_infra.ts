#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TravaMateBookingAgentStack } from "../src/booking-agent/trava-mate-booking-agent-stack";
import { TravMateAgentBookingLambdaStack } from "../src/booking-agent/trava-mate-booking-lambda-stack";

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
const bookingLambdaStack = new TravMateAgentBookingLambdaStack(
  app,
  `TravMateAgentBookingLambdaStack${suffix}`,
  stackProps
);
new TravaMateBookingAgentStack(
  app,
  bookingLambdaStack.bookingLambda,
  `TravaMateBookingAgentStack${suffix}`,
  stackProps
);
