import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { connect as connectDatabase } from "./config/database";

import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();
connectDatabase();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

//parse application/json
app.use(bodyParser.json());

app.use(cors());

// API Routes
mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});