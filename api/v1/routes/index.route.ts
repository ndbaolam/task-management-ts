import { Express } from "express";
import { taskRoutes } from "./task.route";

const mainV1Routes = (app: Express): void => {

  const version: string = "/api/v1";

  app.use(version + "/tasks", taskRoutes);

}

export default mainV1Routes;