import { NextFunction, Request, Response } from 'express';

import { APIError } from '@/shared/errors';

export async function permissionMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    return next(new APIError('User not found', null, 404));
  }

  const userIsPermitted = user.soloManagement.isAdmin || user.soloManagement.isMentor;

  if (userIsPermitted === false) {
    return next(new APIError('Unauthorized', null, 401));
  }

  next();
}

export default permissionMiddleware;
