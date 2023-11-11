import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import getConfig from './config';
import router from './router';

const { port } = getConfig();

const app = express();

app.use(morgan('combined'));
app.use(express.json());

app.use(bodyparser.json());
app.use(cookieParser());

app.use('/api/v1', router.router);

const frontendRoot = '/opt/dist/frontend';
app.use(express.static(frontendRoot));
app.use((req, res) => res.sendFile(`${frontendRoot}/index.html`));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req: Request, res: Response, next: NextFunction) => {
  console.log('err', err);

  // 500
  res.status(500).json({ msg: 'an error occurred' });
});

await mongoose.connect(getConfig().mongoUri);

app.listen(port, () => {
  console.log(
    `application is listening on port ${port}`,
  );
});
