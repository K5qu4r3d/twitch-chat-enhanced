import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { Chat } from './[streamername]';

interface IChatMessageProps {
	messages: Chat[];
}

export interface IMessageAndUrl {
  chat: Chat;
  profileImageUrl: string;
}

const ChatMessage: React.FunctionComponent<IChatMessageProps> = ({ messages }: IChatMessageProps) => {
  const [pairs, setPairs] = useState<IMessageAndUrl[]>([]);

  // TODO: maybe fetch URLs and add to messages props?
	// fetching thumbnail URLs via node-twitch API calls
  useEffect(() => {
    if (messages.length > 0) {
      const usernames: string[] = messages.map(message => {
        const username = message.tags['display-name'];
    
        return username ? username : '';
      });

      const getThumbnails = async () => {
        const response = await fetch('/api/twitch/getProfilePictureUrls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chats: messages,
            usernames: usernames
          })
        });
        
        setPairs(await response.json());
      };
  
      getThumbnails();
    }
  }, [messages]);

	return (
		<React.Fragment>
			{/* messages.map((x: Chat, i: number) => {
          const { tags, message, media } = x;
          const { 'message-type': messageType, 'display-name': displayName, color } = tags;

          if (media) {
            return <div key={i}><img src={media} /></div>;
          } else {
            return (
              <p key={i} className="textstroke">
                <strong style={{ color: color }}>{displayName}</strong>: {message}
              </p>
            );
          }
        }) */
        pairs.map(({ chat, profileImageUrl }: IMessageAndUrl, i: number) => {
          const { tags, message, media } = chat;
          const { 'message-type': messageType, 'display-name': displayName, color } = tags;

          if (media) {
            return <div key={i}><img src={media} /></div>;
          } else {
            return (
              <p key={i} className="textstroke">
                <Image src={profileImageUrl} width={50} height={50} />
                <strong style={{ color: color }}>{displayName}</strong>: {message}
              </p>
            );
          }
        })
        }
		</React.Fragment>
	);
};

export default ChatMessage;