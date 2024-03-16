import { Request, Response } from "express";
import Task from '../models/task.model';

import paginationHelper from "../helpers/pagination.helper";

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

    //Pagination
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(2, req.query, countTasks);
    //End Pagination

    //Search
    if (req.query.keyword) {
        const regex = new RegExp(`${req.query.keyword}`, "i");
        find["title"] = regex;
    }
    //End Search

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination["skip"]);

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

//[PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const status: string = req.body.status;

        await Task.updateOne({
            _id: id,
            deleted: false,
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại!"
        });
    } 
}

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.id;
        const key: string = req.body.key;
        const value: string = req.body.value;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });

                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                break;
                
            case "delete":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });

                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                });
                break;
            
            default:
                res.json({
                    code: 400,
                    message: "Cập nhật thất bại!"
                })
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        })
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        req.body.createdBy = res.locals.user.id;
        const newTask = new Task(req.body);
        const data = await newTask.save();

        res.json({
            code: 200,
            message: "Thêm thành công!",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thêm thất bại!"
        });
    }
}


export const edit = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;

        await Task.updateOne({_id: id}, req.body);

        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        });
    }
}

//[DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        await Task.updateOne({
            _id: req.params.id,
            deleted: false,
        }, {
            deleted: true,
            deletedAt: new Date()
        });

        res.json({
            code: 200,
            message: "Xóa thành công!",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại!"
        })
    }
}