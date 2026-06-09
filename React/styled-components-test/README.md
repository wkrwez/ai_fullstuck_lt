# css in js

- 可以直接创建标签与样式，作为组件使用的同时可以修改该组件的标签。
- 可以传递参数、修改参数的值（attrs）、继承样式。attrs 支持函数、对象
- 可以给普通组件添加样式，但是组件必须接收className参数。
- props 使用 $ 以便于区分组件是样式组件还是框架组件。
- 默认情况下，样式组件会把你在外部传入的所有属性（props），自动透传（forward）给被包裹的底层组件，除了那些以 $ 开头的临时样式属性。（forward.tsx）
  1. $ 作为临时样式不会透传到样式组件的 DOM 上
  2. 外层样式组件通过 styled(Bbb) 包裹内层 Bbb 组件，Aaa组件的非 $ 的 props 会透传给 Bbb 组件。
  3. 两个样式组件定义时没有关联，只是普通父子组件包裹，父组件的非 $ 属性无法透传
  4. 属性可以通过 shouldForwardProp 函数过滤掉

  ```typescript
  // 定义一个带样式的 input 组件
  const StyledInput =
    styled.input <
    { $fontColor: string } >
    `
  color: ${(props) => props.$fontColor};
  `;
  // 使用时传入参数
  <StyledInput
    $fontColor="#fc5185"
    placeholder="请输入"
  />;
  <!-- $fontColor 被拦截，仅用于计算 CSS 颜色，不会传递给 <input> 标签。
       placeholder 不是样式专属属性，所以它会透传到最终的 <input> DOM 节点上。 -->
  ```

- & 符号代表的是当前样式组件的实例，&& 代表 .aaa .aaa 来提升优先级
- 多个样式传递使用 RuleSet
- ThemeProvider 和 useTheme 底层使用 React 的 Context。useTheme 会拿到最近的外层组件 ThemeProvider 的 theme
- 优点：
- 编译后的代码可以做到样式隔离，拥有唯一的className
