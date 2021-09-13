import { Request, Response, Application, Router, json } from 'express';
import TwitchApi from 'node-twitch';

const router = Router();

const routes = (app: Application): Router => {
  app.use(json());

  router.post('/twitch/thumbnailUrls', async (req: Request, res: Response) => {
    const usernames: string[] = req.body['usernames'];
    
    const twitch = new TwitchApi({
      client_id: (process.env.CLIENT_ID as string),
      client_secret: (process.env.CLIENT_SECRET as string)
    });
    
    const users = await twitch.getUsers(usernames);

    res.send({ urls: users.data.map(datum => datum.profile_image_url) });
  });

  return router;
};

export default routes;