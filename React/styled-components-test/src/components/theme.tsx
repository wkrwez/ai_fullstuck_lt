import { useState } from "react";
import { styled, ThemeProvider, useTheme } from "styled-components";

const Aaa = styled.div`
  width: 100px;
  height: 100px;
  background: ${(props) => (props.theme.dark ? "black" : "#ccc")};
`;
function Content() {
  const theme = useTheme();
  const [dark, setDark] = useState<boolean>(theme.dark);

  return (
    <>
      <button onClick={() => setDark(!dark)}>切换</button>
      <ThemeProvider theme={{ dark }}>
        <Aaa></Aaa>
      </ThemeProvider>
    </>
  );
}

export function Context() {
  return (
    <ThemeProvider theme={{ dark: true }}>
      <Content></Content>
    </ThemeProvider>
  );
}
