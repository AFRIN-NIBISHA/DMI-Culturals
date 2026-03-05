const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Success' }));
});

server.listen(5000, () => {
    console.log('Raw HTTP server running on 5000');
});
