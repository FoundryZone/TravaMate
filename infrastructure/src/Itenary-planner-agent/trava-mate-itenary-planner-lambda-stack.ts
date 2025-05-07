import { Duration, CfnOutput } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { BaseStack, MyStackProps } from "../../base-stack";
import * as path from "node:path";

export class TravaMateItenaryPlannerLambdaStack extends BaseStack {
  public iternaryPlannerLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: MyStackProps) {
    super(scope, id, props);

    this.iternaryPlannerLambda = new lambda.Function(this, "ItenaryPlannerLambda", {
      functionName: `ItenaryPlannerLambda${props?.suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda-handler")),
      handler: "index.handler",
      timeout: Duration.seconds(30),
      memorySize: 128,
    });

    new CfnOutput(this, "ItenaryPlannerLambdaARN", {
      value: this.iternaryPlannerLambda.functionArn,
    });

    this.iternaryPlannerLambda.addPermission("AllowBedrock", {
      principal: new iam.ServicePrincipal("bedrock.amazonaws.com"),
      action: "lambda:InvokeFunction",
      sourceArn: `arn:aws:bedrock:${props?.env?.region}:${props?.env?.account}:agent/*`,
    });
  }
}