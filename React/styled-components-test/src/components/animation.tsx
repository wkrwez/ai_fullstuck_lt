import { styled, keyframes, css, type RuleSet } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
// 复用css，不加css会报错
const animation = css<{ $duration?: number }>`
  animation: ${rotate} ${(props) => props.$duration}s linear infinite;
`;
export const Rotate = styled.div<{ $duration?: number; otherStyle?: RuleSet }>`
  display: inline-block;
  ${animation}
  font-size: 50px;
  padding: 30px;
  ${(props) => props.otherStyle}
`;
