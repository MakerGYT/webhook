# 服务端渲染
服务端在收到对目录的请求时，发送数据并将数据渲染到前端
由于服务端截断了请求，不能直接根据网站根目录访问文件
```js
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
// equal
app.use('/', express.static('public'));
```
# 客户端/浏览器渲染
浏览器请求页面，通过接口获取到数据后绑定到页面状态
# 同一服务
仍然使用接口异步获取数据，不跨域
