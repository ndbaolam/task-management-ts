"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_helper_1 = __importDefault(require("../helpers/pagination.helper"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find['status'] = req.query.status;
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[`${req.query.sortKey}`] = req.query.sortValue;
    }
    const countTasks = yield task_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_helper_1.default)(2, req.query, countTasks);
    if (req.query.keyword) {
        const regex = new RegExp(`${req.query.keyword}`, "i");
        find["title"] = regex;
    }
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination["skip"]);
    res.json(tasks);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield task_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    res.json(task);
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({
            _id: id,
            deleted: false,
        }, {
            status: status
        });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại!"
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.id;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case "status":
                yield task_model_1.default.updateMany({
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
                yield task_model_1.default.updateMany({
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
                });
                break;
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.createdBy = res.locals.user.id;
        const newTask = new task_model_1.default(req.body);
        const data = yield newTask.save();
        res.json({
            code: 200,
            message: "Thêm thành công!",
            data: data
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Thêm thất bại!"
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield task_model_1.default.updateOne({
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
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại!"
        });
    }
});
exports.deleteTask = deleteTask;
