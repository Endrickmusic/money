import { Container, TopLeft, BottomLeft, BottomRight, Hamburger } from './styles'

export default function Overlay() {
  return (
    <Container>
      <TopLeft>
        <h1>
          ICH MACHE 
          <br />
          ALLES FUER GELD
        </h1>
        <p>In React & Threejs —</p>
      </TopLeft>
      <BottomLeft>
        An idea by <a href="https://www.endrick.de">Endrick</a>
      </BottomLeft>
      <BottomRight>
        Inspiration and ideas
        <br />
        Fundamentals
        <br />
        Finding models
        <br />
        Preparing them for the web
        <br />
        Displaying and changing models
        <br />
        Animation fundamentals
        <br />
        Effects and making things look good
        <br />
        Performance and time to load
        <br />
      </BottomRight>
      <Hamburger>
        <div />
        <div />
        <div />
      </Hamburger>
    </Container>
  )
}
