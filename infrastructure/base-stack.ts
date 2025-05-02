import { CfnElement, Stack, StackProps } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct, Node } from "constructs";

export interface MyStackProps extends cdk.StackProps {
  suffix: string;
}

export class BaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: MyStackProps) {
    super(scope, id, props);
  }
}
