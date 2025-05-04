#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TravaMateInfraStack } from "../src/trava_mate_booking_agent-stack";
import { TravMateAgentBookingLambdaStack } from "../src/trava_mate_agent_booking_lambda-stack";

const app = new cdk.App();
const suffixProvided = app.node.tryGetContext("suffix");
const suffix = suffixProvided ? `-${suffixProvided}` : "";
const stackProps = { suffix: suffix };

new TravaMateInfraStack(app, `TravaMateInfraStack${suffix}`, stackProps);
new TravMateAgentBookingLambdaStack(app, `TravMateAgentBookingLambdaStack${suffix}`, stackProps);
