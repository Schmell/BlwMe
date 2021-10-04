const http = require('http')
const server = http.createServer(function(req, res){
    res.setHeader('Content-type', 'application/json')
    res.setHeader('Access-Control-Allow-origin', '*')
    res.writeHead(200)
    let data = { id:123, name:'Bob', email:'email@email.com' }

    res.end(JSON.stringify(data))
    

})
server.listen(1234, function(){
    console.log('listening')
})