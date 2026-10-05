const http = require('http');
const url = require('url');

const fs = require('fs');

const Utils = require('./modules/utils');
const EnglishMessages = require('./lang/en/en');

class Server {
    constructor(port) {
        this.port = port;
        this.utils = new Utils();
        this.messages = new EnglishMessages();
    }

    start() {
        http.createServer((req, res) => {
            this.handleRequest(req, res);
        }).listen(this.port);

        console.log(`Server is running at http://localhost:${this.port}`);
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);

        if (parsedUrl.pathname === '/getDate/') {
            this.handleGetDate(parsedUrl, res);
            return;
        }

        if (parsedUrl.pathname === '/writeFile/') {
            this.handleWriteFile(parsedUrl, res);
            return;
        }

        if (parsedUrl.pathname.startsWith('/readFile/')) {
            this.handleReadFile(parsedUrl, res);
            return;
    }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }

    handleGetDate(parsedUrl, res) {
        const name = parsedUrl.query.name;
        const greeting = this.messages.getGreeting().replace('%1', name);
        const date = this.utils.getDate();

        const response = `<p style="color: blue;">${greeting} * ${date}</p>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(response);
    }

    handleWriteFile(parsedUrl, res) {
        const text = parsedUrl.query.text;

        fs.appendFile('file.txt', `${text}\n`, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error writing to file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Successfully appended "${text}" to file.txt`);
        });
    }

    handleReadFile(parsedUrl, res) {
        const fileName = parsedUrl.pathname.replace('/readFile/', '');

        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`${fileName} 404 Not Found`);
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }
}

const server = new Server(8080);
server.start();