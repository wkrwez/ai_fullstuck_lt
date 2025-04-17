# jwt 怎么保证正确

- 定义
  - 由 header payload（载荷） signature（签名）三个部分组成
- signature（签名）：

## 验证过程

1. 将 header payload 通过 base64 解码得到原始 JSON
2. 使用密钥和生成时所用算法重新计算签名，与原始签名比较。
3. 如果上方验证通过则验证 payload（载荷），过期事件，唯一标识符等等。

## 为什么无法伪造

1. 会使用 header 中得算法和密钥重新计算签名进行比较，即使比较通过也需要验证 payload 得过期时间和签发者等等。
2. 密钥是存储在服务端，只有服务器知道。
3. 就算 Header 和 Payload 是经过 Base64Url 编码的，就算知道了签名也不相同。
