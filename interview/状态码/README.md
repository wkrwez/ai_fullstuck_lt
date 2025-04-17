1. 信息性状态码（1xx）
   这些状态码表示请求已被接收，客户端应继续处理。

100 Continue：服务器已收到请求头，客户端应继续发送请求体。
101 Switching Protocols：服务器已理解客户端的请求，并将通过升级协议来进行处理。 2. 成功状态码（2xx）
这些状态码表示请求已成功被服务器接收、处理并响应。

200 OK：请求成功，响应体包含所请求的数据。
201 Created：请求成功并且服务器创建了新的资源。
202 Accepted：请求已接受，但尚未处理完成。
204 No Content：请求成功，但响应体为空。 3. 重定向状态码（3xx）
这些状态码表示客户端需要采取进一步的操作才能完成请求。

301 Moved Permanently：请求的资源已永久移动到新位置,浏览器会缓存 URL，下次自动跳转。
302 Found：请求的资源临时从不同的 URL 响应请求。
304 Not Modified：资源未修改，客户端可以使用缓存的版本。
307 Temporary Redirect：请求的资源临时从不同的 URL 响应请求，但请求方法不应改变。
308 Permanent Redirect：请求的资源已永久移动到新位置，且将来所有的请求都应使用新的 URI。 4. 客户端错误状态码（4xx）
这些状态码表示请求有误，客户端需要修正请求后重新发送。

400 Bad Request：请求无效或无法被服务器理解。
401 Unauthorized：请求要求用户的身份认证。
403 Forbidden：服务器理解请求，但拒绝执行。
404 Not Found：请求的资源未找到。
405 Method Not Allowed：请求方法对资源不适用。
409 Conflict：请求冲突，通常发生在并发操作中。
410 Gone：请求的资源已不再可用，且服务器不知道新的位置。
413 Payload Too Large：请求的负载过大，服务器无法处理。
415 Unsupported Media Type：请求的格式不受支持。
429 Too Many Requests：客户端发送的请求过多，触发了限流。 5. 服务器错误状态码（5xx）
这些状态码表示服务器在处理请求时发生了错误。

500 Internal Server Error：服务器遇到意外情况，无法完成请求。
501 Not Implemented：服务器不支持请求的方法。
502 Bad Gateway：服务器作为网关或代理，从上游服务器收到了无效的响应。
503 Service Unavailable：服务器暂时无法处理请求，通常是因为过载或维护。
504 Gateway Timeout：服务器作为网关或代理，未能及时从上游服务器获得响应。
505 HTTP Version Not Supported：服务器不支持请求的 HTTP 版本。
常见用途
200 OK：最常见的成功响应。
400 Bad Request：客户端请求有误。
401 Unauthorized：需要身份验证。
403 Forbidden：权限不足。
404 Not Found：资源未找到。
500 Internal Server Error：服务器内部错误。
