import * as cdk from "@aws-cdk/core";
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import { join } from "path";

export class CodeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const wrapperScriptLayer = new lambda.LayerVersion(
      this,
      "wrapperScriptLayer",
      {
        code: lambda.Code.fromAsset(join(__dirname, "../wrapper-script"))
      }
    );

    const assetsBucket = new s3.Bucket(this, "assets-bucket");

    const handler = new lambda.Function(this, "handler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        const fs = require("fs");
        module.exports.handler = async () => {
          const configFile = fs.readFileSync(process.env.CONFIG_FILE_PATH, "utf8");
          console.log(configFile.toString());
        }
      `),
      layers: [wrapperScriptLayer],
      environment: {
        CONFIG_FILE_PATH: "/tmp/config.json",
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/wrapper-script",
        BUCKET_NAME: assetsBucket.bucketName,
        CONFIG_FILE_KEY: "config.json"
      }
    });

    assetsBucket.grantRead(handler);
  }
}
