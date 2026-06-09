import styled from "styled-components";

// 内层样式组件
const InnerBox = styled.div<{ $bgColor: string }>`
  padding: 20px;
  background-color: ${(props) => props.$bgColor};
`;

// 外层样式组件包裹内层样式组件
const OuterBox = styled(InnerBox)<{ $textColor: string }>`
  border: 1px solid ${(props) => props.$textColor};
`;

const Aaa = styled.div<{ $bgColor: string }>`
  padding: 20px;
  background-color: ${(props) => props.$bgColor};
`;

const Bbb = styled.div<{ $textColor: string }>`
  border: 1px solid ${(props) => props.$textColor};
`;

export function ForwardTest() {
  return (
    // <OuterBox
    //   $bgColor="#f5f5f5" // 1. 属于 InnerBox 的临时样式属性，正常生效
    //   $textColor="red" // 2. 属于 OuterBox 的临时样式属性，正常生效
    //   data-id="123" // 3. 【重点】非 $ 开头的普通属性，会自动透传给 InnerBox
    // >
    //   Hello World
    // </OuterBox>
    <Aaa
      $bgColor="#f5f5f5"
      data-id="123"
    >
      <Bbb $textColor="red"></Bbb>
    </Aaa>
  );
}

// 拦截属性传递
const Box = styled("div").withConfig({
  // 这是一个过滤函数：如果属性名是 'customProp'，则返回 false（不传递）
  shouldForwardProp: (prop) => !["customProp"].includes(prop),
})<{ customProp: string }>`
  /* 依然可以在样式中正常使用 customProp */
  color: ${(props) => (props.customProp === "danger" ? "red" : "black")};
  padding: 20px;
`;

export function IsForwardProp() {
  return (
    <div>
      {/* 
        customProp 参与了颜色样式的计算，
        但因为被 shouldForwardProp 拦截，所以不会挂载到底层 div 的 DOM 属性上。
      */}
      <Box customProp="danger">危险提示框</Box>
    </div>
  );
}
