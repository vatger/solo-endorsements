import { Request, Response } from 'express';

import fooService from '../services/foo.service';

import sum from '@/shared/utils/sum';

function getFoo(req: Request, res: Response) {
  res.json({
    foo: true,
    msg: fooService.getFooDetails(),
    data: req.body,
    sum: sum.sum(0, 1, 2),
  });
}

export default {
  getFoo,
};
