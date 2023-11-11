import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import getConfig from './config';
import router from './router';

const { port } = getConfig();

const app = express();

app.use(morgan('combined'));

app.use('/api', router.router);

const frontendRoot = '/opt/dist/frontend';
app.use(express.static(frontendRoot));
app.use((req, res) => res.sendFile(`${frontendRoot}/index.html`));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req: Request, res: Response, next: NextFunction) => {
  console.log('err', err);
  
  // 500
  res.status(500).json({ msg: 'an error occurred' });
});

app.listen(port, () => {
  console.log(
    `application is listening on port ${port}`,
  );
});
