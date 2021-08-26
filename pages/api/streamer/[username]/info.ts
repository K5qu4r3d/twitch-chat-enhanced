import TwitchApi from 'node-twitch';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getUserInfo(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (typeof req.query['username'] === 'string') {
      const twitchApi = new TwitchApi({
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`
      });

      const users = await twitchApi.getUsers(req.query['username']);
      const profileImageUrl = users.data[0].profile_image_url;

      res.status(200).json({status: 'OK', data: users.data[0], profileImageUrl: profileImageUrl});
    }
    else {
      res.status(500).json({message: 'Query must contain a single username'});
    }
  }
  else {
    res.status(500).json({message: 'Request must be a POST'});
  }
}