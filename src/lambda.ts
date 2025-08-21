import serverlessExpress from "@codegenie/serverless-express";
import app from "./index";

export const handler = serverlessExpress({ app });
