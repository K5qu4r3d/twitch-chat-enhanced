import React, { useState, useEffect, useRef, ReactElement } from 'react';
import styled from 'styled-components';
import TwitchApi from 'node-twitch';
import { GetStaticProps } from 'next';

interface IIndexProps {
  api: string
}

export const getStaticProps: GetStaticProps = async () => {
  const api = new TwitchApi({
    client_id: `${process.env.CLIENT_ID}`,
    client_secret: `${process.env.CLIENT_ID}`
  });

  console.log(api);

  const apiString = JSON.stringify(api);

  return {
    props: {
      api: apiString
    }
  };
}

export const Index = ({ api }: IIndexProps): ReactElement => {
  console.log(JSON.parse(api));

  return (
    <Container>
      <h2 className="example">hello world</h2>
    </Container>
  )
}

const Container = styled.div`
  .example {
  color: blue;
  }

`

export default Index;
