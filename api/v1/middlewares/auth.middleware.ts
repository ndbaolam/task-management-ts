import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if(req.headers.authorization){
      const token: string = req.headers.authorization.split(' ')[1];

      const user = await User.findOne({
        token: token,
        deleted: false
      }).select('-password -token');

      if(!user){
        res.json({
          code: 400,
          message: "Token không hợp lệ"
        });
      } else {
        res.locals.user = user;
        next();
      }
    } else {
      res.json({
        code: 400,
        message: "Vui lòng gửi thêm token"
      });
    }
  } catch (error) {
    res.json(error);
  }
}