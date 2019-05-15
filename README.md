# 服务端
服务端启动一个webhook监听服务,该服务会在收到push消息后执行脚本,存在则更新，不存在则克隆安装
```js
// config.js
module.exports = {
    path: '',
    secret: '',
    contentType: 'application/json'
}
```
# 本地
本地git提交
# git仓库
所有待部署的仓库配置相同的[webhook](https://github.com/MakerGYT/<repository>/settings/hooks/new)
- Payload URL
- Content type(application/json)
- Secret

# web
在打开站点时，调用接口读取git log并输出到页面