// wrapper-script/index.js

const S3 = require("aws-sdk/clients/s3");
const fs = require("fs-extra");

const s3Client = new S3();

async function main() {
  const result = await s3Client
    .getObject({
      Key: process.env.CONFIG_FILE_KEY,
      Bucket: process.env.BUCKET_NAME
    })
    .promise();

  await fs.writeJson(
    process.env.CONFIG_FILE_PATH,
    JSON.parse(result.Body.toString()),
    {
      encoding: "utf-8"
    }
  );
}

process.on("unhandledRejection", () => {
  console.log("unhandled error", e);

  process.exit(1);
});

main();
