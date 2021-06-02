import TwitchApi from 'node-twitch';

export const getThumbnails = async (usernames: string[]): Promise<string[]> => {
  const twitchApi = new TwitchApi({
    client_id: `${process.env.CLIENT_ID}`,
    client_secret: `${process.env.CLIENT_SECRET}`
  });

  const result = await twitchApi.getStreams({ channels: usernames });
  const thumbnailUrls = result.data.map(stream => stream.thumbnail_url);

  return thumbnailUrls;
};

export default getThumbnails;