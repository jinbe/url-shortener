# Serverless Socket Server

This is a URL shortener service hosted on AWS.

The stack is authored and deployed using SST.

## Environment File

Create a file called `.env` in the project root directory.

Generate an API key (it can be in any format) and fill in the file contents as below.

```
API_KEY=[generated api key]
BUCKET=[s3 bucket]
```

## Deploy
```
npm run deploy --  --profile=[aws-profile] --stage=[stage]
```
