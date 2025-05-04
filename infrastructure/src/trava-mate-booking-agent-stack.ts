import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { BaseStack, MyStackProps } from '../base-stack';

export class TravaMateInfraStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: MyStackProps) {
    super(scope, id, props);
    let secret =  new secretsmanager.Secret(this,  `MyTestSecret`, {
      secretName:   `MyTestSecret${props?.suffix}` 
    })
  }
}
