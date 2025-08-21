import serverlessExpress from "@codegenie/serverless-express";
import app from "./index";

const binaryContentTypes: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/octet-stream',
  'application/pdf',
  'application/zip',
  'application/x-sqlite3',
];

export const handler = serverlessExpress({
  app,
  binarySettings: {
    contentTypes: binaryContentTypes,
  }
});
