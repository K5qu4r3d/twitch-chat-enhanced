import express, { Request, Response, Application } from 'express';
import TwitchApi from 'node-twitch';

const router = express.Router();

const routes = (app: Application): express.Router => {
  router.get('/twitch', (_, res: Response) => {
    res.end("asdf");
  });

  router.get('/twitch/:username', async (req: Request, res: Response) => {
    const username = req.params['username'];

    const twitch = new TwitchApi({
      client_id: (process.env.CLIENT_ID as string),
      client_secret: (process.env.CLIENT_SECRET as string)
    });
    
    const users = await twitch.getUsers(username);

    console.log(users.data[0]);

    res.end('username endpoint');
  });

  router.get('/twitch/:usernames', async (req: Request, res: Response) => {
    const usernames = req.params['usernames'];

    console.log(usernames);

    res.end('usernames endpoint');
  });

  return router;
};

export default routes;