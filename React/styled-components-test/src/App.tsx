import { styled, createGlobalStyle } from "styled-components";
import type { FC, PropsWithChildren } from "react";
import { Rotate } from "./components/animation";
import { Context } from "./components/theme";
import { ForwardTest, IsForwardProp } from "./components/forward";

// const Title = styled.h1<{ color?: string }>`
//   font-size: 30px;
//   text-align: center;
//   color: ${(props) => props.color || "black"};
// `;

// const Header = styled.div`
//   padding: 20px;
//   background: pink;
// `;

// const Button = styled.button<{ color?: string }>`
//   font-size: 20px;
//   margin: 5px 10px;
//   border: 2px solid #000;
//   color: ${(props) => props.color || "blue"};
// `;

// const Button2 = styled(Button)`
//   border-radius: 8px;

interface LinkProps extends PropsWithChildren {
  href: string;
  className?: string;
}
// 框架组件
const Link: FC<LinkProps> = (props) => {
  const { href, className, children } = props;

  return (
    <a
      href={href}
      className={className}
    >
      {children}
    </a>
  );
};
// 样式组件
// const StyledLink = styled(Link)<{ $color?: string }>`
//   color: ${(props) => props.$color || "blue"};
//   font-size: 40px;
// `;
// 修改样式组件传递的参数,attrs 函数
const StyledLink = styled(Link).attrs<{ $color?: string }>((props) => {
  console.log(props);

  props.$color = "orange";
  props.children = props.children + " 光";
  return props;
})`
  color: ${(props) => props.$color || "green"};
  font-size: 40px;
`;
// attrs 对象
const Input = styled.input.attrs({ type: "text" })`
  width: 200px;
  height: 30px;
`;
// 伪类
// &.aaa + & 代表 .aaa 的 ColoredText 样式组件之后的一个 ColoredText 样式组件实例
// &.bbb ~ & 就是 .bbb 的 ColoredText 样式组件之后的所有 ColoredText 样式组件实例
const ColoredText = styled.div`
  && {
    color: blue;
  }
  &:hover {
    color: red;
  }

  &::before {
    content: "* ";
  }

  &.aaa + & {
    background: lightblue;
  }

  &.bbb ~ & {
    background: pink;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${ColoredText}{
    color: red;
  }
`;
function App() {
  // return (
  //   <Header>
  //     <Title color="red">Hello World!</Title>
  //     <Button color="red">Hello World!</Button>
  //     <Button2
  //       color="red"
  //       as={"div"}
  //     >
  //       Hello World!
  //     </Button2>
  //   </Header>
  // );
  return (
    <>
      {/* <GlobalStyle />
      <ColoredText>Hello styled components</ColoredText>
      <ColoredText className="aaa">Hello styled components</ColoredText>
      <ColoredText>Hello styled components</ColoredText>
      <ColoredText className="bbb">Hello styled components</ColoredText>
      <div>Hello styled components</div>
      <ColoredText>Hello styled components</ColoredText>
      <ColoredText>Hello styled components</ColoredText>
      <Rotate
        $duration={3}
        otherStyle={[{ color: "red" }]}
      >
        X
      </Rotate> */}
      <Context />
      {/* <Input />
      <StyledLink
        href="https://www.baidu.com"
        $color="red"
      >
        百度一下
      </StyledLink> */}
      {/* <ForwardTest /> */}
    </>
  );
}

export default App;
