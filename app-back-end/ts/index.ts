import express from "express";
import projectRouter from "./routes/project.route";

const app = express();

app.use(express.json());

app.use("/projects",projectRouter);

app.listen(3000,() => {
   console.log("\nServeur écoutant sur 3000, prêt à recevoir des requêtes !\n"); 
});