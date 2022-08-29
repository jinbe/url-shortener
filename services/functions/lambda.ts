import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import ShortUniqueId from 'short-unique-id';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(`Invalid request body`)
    };
  }

  const {apiKey, url, permanent} = JSON.parse(event.body) as {
    apiKey: string;
    url: string;
    permanent: boolean;
  };

  if (!apiKey || apiKey !== process.env.apiKey) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(`Unauthorized`)
    };
  }

  if (!url) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(`Invalid URL`)
    };
  }

  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!regex.test(url)) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(`Invalid URL - must comply with RFC 3987`)
    };
  }

  const uid = new ShortUniqueId({length: 6});
  const fileName = uid();

  const s3 = new AWS.S3();

  const key = permanent ? `p/${fileName}` : `u/${fileName}`;
  const shortUrl = `${process.env.short}/${key}`;

  try {
    await new Promise((resolve, reject) => {
      s3.putObject({
        Key: key,
        Bucket: `${process.env.bucket}`,
        ACL: 'public-read',
        WebsiteRedirectLocation: url,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      longUrl: url,
      shortUrl
    })
  };
};
