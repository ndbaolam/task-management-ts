import { Request, Response } from "express";
import Task from '../models/task.model';

export const index = async (req: Request, res: Response): Promise<void> => {
    const find = {
        deleted: false,
    }

    if(req.query.status){
        find['status'] = req.query.status;
    }

    //Sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[`${req.query.sortKey}`] = req.query.sortValue;
    }
    //End Sort

    const tasks = await Task.find(find).sort(sort);

    res.json(tasks);    
}

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;
  
    const task = await Task.findOne({
      _id: id,
      deleted: false
    });
  
    res.json(task);
}