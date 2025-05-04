import { Duration, CfnOutput } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../base-stack";
import * as path from "node:path";

export class TravMateAgentBookingLambdaStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: MyStackProps) {
    super(scope, id, props);
    const bookingLambda = new lambda.Function(this, "BookingLambda", {
        functionName: `BookingLambda${props?.suffix}`,
        runtime: lambda.Runtime.NODEJS_22_X,
        code: lambda.Code.fromAsset(path.join(__dirname, "booking-lambda-handler")),
        handler: "index.handler",
        timeout: Duration.seconds(30),
        memorySize: 128,
    });

    new CfnOutput(this, "BookingLambdaARN", {
        value: bookingLambda.functionArn
    });
  }
}
