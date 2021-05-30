import React, { useState, useEffect, useRef, ReactElement } from 'react';
import styled from 'styled-components';

export const Index = (): ReactElement => {
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
