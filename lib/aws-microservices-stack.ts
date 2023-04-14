import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: 'product',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST, 
    });

    const fn = new Function(this, 'MyFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset(join(__dirname, 'lambda-handler')),
    });

  }
}
  