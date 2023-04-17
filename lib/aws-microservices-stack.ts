import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
/* import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'; // <--- this is the old import */
import { join } from 'path';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
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

    const nodejsFunctionProps: NodejsFunctionProps = {
      bundling:
      {
        externalModules: [
          'aws-sdk'
        ],
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName,
      },
      runtime: Runtime.NODEJS_14_X,
    };

    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, '/../src/product/index.js'),
      ...nodejsFunctionProps,
    });

    productTable.grantReadWriteData(productFunction); // Burada productTable'a veri yazma ve okuma izni veriyoruz.

    //product
    //get product
    //post product

    //Get /product{id}
    //Put /product{id}
    //Delete /product{id}

    const apigw = new LambdaRestApi (this, 'productApi', {
      restApiName : 'Product Service',
      handler: productFunction,
    });

    const product = apigw.root.addResource('product');
    product.addMethod('GET');
    product.addMethod('POST');

    const singleProduct = product.addResource('{id}');
    singleProduct.addMethod('GET');
    singleProduct.addMethod('PUT');
    singleProduct.addMethod('DELETE');
    
  }
}
