import { Api, StackContext } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          apiKey: process.env.API_KEY || '',
          bucket: process.env.BUCKET || '',
        },
      },
    },
    routes: {
      "POST /": "functions/lambda.handler",
    },
  });

  api.attachPermissions(['s3:PutObject']);

  stack.addOutputs({
    ApiEndpoint: api.url
  });
}
