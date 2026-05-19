import styled from "@emotion/styled"
import mitLearnLogo from "./mit-learn-logo.svg"
import mitLogo from "./mit-logo.svg"

const Container = styled.div({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "48px",
  img: {
    height: "24px"
  }
})

export default function Logos() {
  return (
    <Container>
      <img src={mitLearnLogo} alt="" height={24} />
      <a href="https://mit.edu" title="MIT Homepage">
        <img src={mitLogo} alt="" height={24} />
      </a>
    </Container>
  )
}
