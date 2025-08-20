import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => res.send("API up and running!"));

export default app;

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running locally");
  });
}
