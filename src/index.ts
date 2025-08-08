import express from "express";
import dotenv from "dotenv";
import nivelRouter from "./routes/nivel.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/niveis", nivelRouter);

app.get("/", (req, res) => res.send("API up and running!"));

export default app;

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running locally");
  });
}
