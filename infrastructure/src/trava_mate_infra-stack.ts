import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class TravaMateInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let secret =  new secretsmanager.Secret(this, "MyTestSecret", {
      secretName: "MyTestSecret"
    })
  }
}
