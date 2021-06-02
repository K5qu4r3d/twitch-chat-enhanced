import React from 'react';
import getThumbnails from '../src/utils/GetThumbnails';
import { Chat } from './[streamername]';

interface IChatmessageProps {
	messages: Chat[]
}

const ChatMessage: React.FunctionComponent<IChatmessageProps> = ({ messages }: IChatmessageProps) => {
	const usernames = messages.map(message => {
		const username = message.tags['display-name'];

		return username ? username : '';
	});

	const thumbnailUrls = getThumbnails(usernames);
	console.log(thumbnailUrls);

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