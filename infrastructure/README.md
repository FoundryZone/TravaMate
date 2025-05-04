# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

# run following command to create stak for your branch

* `cdk deploy -c suffix="TM-4" --all`

# run following command to run deployed lambda

aws lambda invoke `
>>   --function-name <Lambda Name> `
>>   --payload <payload string in json> ` 
>>   --cli-binary-format raw-in-base64-out `
>>   output.json