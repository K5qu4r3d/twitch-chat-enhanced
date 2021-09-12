import express, { Request, Response } from 'express';
import next from 'next';
import routes from './routes/routes';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();

(async () => {
  try {
    await app.prepare();

    const server = express();

    server.use('/api', routes(server));

    server.get('*', (req: Request, res: Response) => {
      return handler(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) {
        throw err;
      }

      console.log(`> Ready on http://localhost:${port}...`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();