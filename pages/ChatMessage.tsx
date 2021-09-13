import React, { useState, useEffect } from 'react';
import { Chat } from './[streamername]';

interface IChatmessageProps {
	messages: Chat[]
}

const ChatMessage: React.FunctionComponent<IChatmessageProps> = ({ messages }: IChatmessageProps) => {
	const [usernames, setUsernames] = useState<string[]>([])
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);

	// fetching thumbnail URLs via node-twitch API calls
  useEffect(() => {
    setUsernames(messages.map(message => {
      const username = message.tags['display-name'];
  
      return username ? username : '';
    }));

    const getThumbnails = async () => {
      if (usernames.length > 0) {
        const obj = {
          usernames: usernames
        };
    
        const response = await fetch('/api/twitch/thumbnailUrls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        });
    
        const responseJson = await response.json();

        setThumbnailUrls(responseJson['urls']);
      }
    };

    getThumbnails();
  }, [messages]);
	
	return (
		<React.Fragment>
			{messages.map((x: Chat, i: number) => {
				const { tags, message, media } = x;
				const { 'message-type': messageType, 'display-name': displayName, color } = tags;

				if (media) {
					return <div key={i}><img src={media} /></div>;
				} else {
					return <p key={i} className="textstroke"><strong style={{ color: color }}>{displayName}</strong>: {message}</p>;
				}
			})}
		</React.Fragment>
	);
};

export default ChatMessage;