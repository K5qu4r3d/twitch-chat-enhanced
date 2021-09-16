import express, { Request, Response, json } from 'express';
import next from 'next';
import TwitchApi from 'node-twitch';
import { User } from 'node-twitch/dist/types/objects';
import { IMessageAndUrl } from '../pages/ChatMessage';

import { Chat } from '../pages/[streamername]';
// import routes from './routes/routes';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();

(async () => {
  try {
    await app.prepare();

    const server = express();

    server.use(json());

    // server.use('/api', routes(server));

    server.get('*', (req: Request, res: Response) => {
      return handler(req, res);
    });

    server.post('/api/twitch/getProfilePictureUrls', async (req: Request, res: Response) => {
      const chats: Chat[] = req.body['chats'];

      const twitch = new TwitchApi({
        client_id: (process.env.CLIENT_ID as string),
        client_secret: (process.env.CLIENT_SECRET as string)
      });
      
      const users = await twitch.getUsers(req.body['usernames']);
      
      res.send(users.data.map((user: User, index: number) => {
        return {
          chat: chats[index],
          profileImageUrl: user.profile_image_url
        };
      }));
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