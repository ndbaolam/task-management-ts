import { Router } from "express";
const router: Router = Router();

import * as controller from "../controllers/task.controller";

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/edit/:id", controller.edit);

router.delete("/edit/:id", controller.deleteTask);

router.post("/create", controller.create);

export const taskRoutes: Router = router;
