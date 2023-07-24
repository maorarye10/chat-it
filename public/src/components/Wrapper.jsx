import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #131324;

  /* xs */
  @media (min-width: 475px) {
    .container {
      max-width: 475px;
    }
  }

  /* sm */
  @media (min-width: 640px) {
    .container {
      max-width: 640px;
    }
  }

  /* md */
  @media (min-width: 768px) {
    .container {
      max-width: 768px;
    }
  }

  /* lg */
  @media (min-width: 1024px) {
    .container {
      max-width: 1024px;
    }

    .section {
      margin-top: 10rem;
    }
  }

  /* xl */
  @media (min-width: 1280px) {
    .container {
      max-width: 1280px;
    }
  }

  /* 2xl */
  @media (min-width: 1536px) {
    .container {
      max-width: 1536px;
    }
  }
`;

export const Wrapper = ({children}) => {
  return (
    <Container>
      {children}
    </Container>
  )
}
