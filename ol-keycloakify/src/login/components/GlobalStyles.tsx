import React from "react"
import { css, Theme, Global } from "@emotion/react"

const pageCss = (theme: Theme) => css`
  html {
    font-family: ${theme.typography.body1.fontFamily};
    color: ${theme.typography.body1.color};
  }

  body {
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  h1 {
    font-size: ${theme.typography.h1.fontSize};
  }

  h2 {
    font-size: ${theme.typography.h2.fontSize};
  }

  h4 {
    font-size: ${theme.typography.h4.fontSize};
  }
`

const GlobalStyles: React.FC = () => {
  return <Global styles={pageCss}></Global>
}

export { GlobalStyles }
