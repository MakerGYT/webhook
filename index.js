var http = require('http')
var {spawn} = require('child_process');
var createHandler = require('github-webhook-handler');
const { path, secret} = require('./config');
var handler = createHandler({ path, secret});

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(6666);

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  var child = spawn( 'sh', ['./webhook.sh', event.payload.repository.name, event.payload.repository.clone_url],);

  var response = ''
  child.stdout.on('data', function( buffer ){ response += buffer.toString(); });
  child.stdout.on('end', function(){ 
    console.log(response);
   });
  //exec('./webhook.sh '+event.payload.repository.name);
})
