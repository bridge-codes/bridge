import { initBridge } from 'bridge';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { api } from './config';
import routes from './routes';
import errorHandler from './errorHandler';

const app = express();

app.enable('trust proxy');
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.get('/', (req, res) => res.send(`Welcome on ${api.projectName}, mode: ${api.env}`));

const bridge = initBridge({ routes, errorHandler });

app.use('', bridge.expressMiddleware());

app.listen(api.port, () => {
  console.log(`Listening on port ${api.port}`);
});
