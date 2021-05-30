import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import styled from 'styled-components'
import tmi, { ChatUserstate } from 'tmi.js';
import find from 'lodash.find';

import { imgSearch } from '../src/utils/images'
import ChatMessage from './ChatMessage';

import TwitchApi from 'node-twitch';
import { GetServerSideProps } from 'next';

interface IHomeProps {
  thumbnailUrl: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  const twitch = new TwitchApi({
    client_id: `${process.env.CLIENT_ID}`,
    client_secret: `${process.env.CLIENT_SECRET}`
  });

  let thumbnailUrl = '';
  
  if (params && typeof params.streamername === 'string') {
    const { data } = await twitch.getStreams({ channel: params.streamername });

    thumbnailUrl = data[0].thumbnail_url;
  }

  return {
    props: { thumbnailUrl: thumbnailUrl }
  };
};

export interface Chat {
  tags: ChatUserstate;
  message: string;
  media?: string;
}

export const Home = ({ thumbnailUrl }: IHomeProps): React.ReactElement => {
  console.log(`thumbnailUrl: ${thumbnailUrl}`);
  
  const router = useRouter()
  const { streamername }: any = router.query
  const [messages, setMesssages] = useState<Chat[]>([]);
  const [socketClient, setSocketClient] = useState();


  const imgRegex = new RegExp('img (.+)', 'i');
  const bottomDivRef = useRef(null);
  const scrollToBottom = (): void => {
    if (bottomDivRef !== null) {
      bottomDivRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  useEffect(() => {
    if (streamername !== undefined) {
      const client: any = new tmi.Client({
        connection: { reconnect: true },
        channels: [`${streamername}`]
      });
      setSocketClient(client)
      client.connect();
    }

  }, [streamername]);

  useEffect(() => {

    if (socketClient !== undefined) {
      socketClient.on('message', (channel: string, tags: ChatUserstate, message: string, self: any) => {
        let merged: Chat = { tags, message };
        const exists: boolean = !!find(messages, merged);
        if (!exists) {
          setMesssages(messages => [...messages, merged])
          scrollToBottom();
        }

        if (imgRegex.test(message)) {
          (async (): Promise<void> => {

            let imgQuery: any[] = message.split('img ');
            let imgQueryString: string = imgQuery.pop();

            const url: string | undefined = await imgSearch(imgQueryString);
            let image = {
              media: url!,
              message: '',
              tags: { 'display-name': 'MiyaoBot', 'message-type': 'botImage' }
            }
            setMesssages(messages => [...messages, image])
            scrollToBottom();

          })();
        }


      });

    }

  }, [socketClient]);

  console.log({ messages });

  const limit = 400;

  if (messages.length > limit) {
    setMesssages(messages.slice(-limit));
  }

  return (
    <div>
      <Container>
        <ChatMessage messages={messages} />
      </Container>
      <div ref={bottomDivRef}></div>
    </div>
  );
}

const Container = styled.div`
  .textstroke {
  color: white;
  -webkit-font-smoothing: antialiased;
  text-shadow: #000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px,
             #000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px;
  //text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }

`

export default Home;
