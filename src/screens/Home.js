import styled from "styled-components";
import { isLoggedInVar } from "../apollo";

const Title = styled.h1`
  color: bisque;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;
const Container = styled.div`
  background-color: tomato;
`;

function Home() {
  return (
    <Container>
      <Title>Home</Title>
      <button onClick={() => isLoggedInVar(false)}>Log out now!</button>
    </Container>
  )
}
export default Home