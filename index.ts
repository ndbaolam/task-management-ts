import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connect as connectDatabase } from "./config/database";

import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();
connectDatabase();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// API Routes
mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});