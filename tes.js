var http = require('http');
var fs = require('fs');
var url = require('url');
const { Console } = require('console');
const { finished } = require('stream');


var server = http.createServer((request, response) => {
    if (!request) {
        response.end();
        return;
    }

    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    if (pathname === '\/' || pathname === '') {
        pathname = '/1/top100.html';
    }
    if (pathname.indexOf('iflowOpenTime.html') !== -1) {
        handleIflowOpenTime(request, response);
    } else if (pathname.indexOf('detailOpenTime.html') !== -1) {
        handleDetailOpenTime(request, response);
    } else if (pathname.indexOf('error.html') !== -1) {
        handleErrorCode(request, response);
    } else {
        openHtml(pathname, response);
    }
});

function handleIflowOpenTime(request, response) {
    var date = new Date().toLocaleString();
    var url = request.url || '';
    var info = url.substr(url.indexOf('?') + 1);

    try {
        fs.writeFile('./opentime/iflow.log', '\n' + date + ' ' + info, { 'flag': 'a+' },
            error => console.log(error ? 'write failed' : 'write success'));
    } finally {}
}


function handleDetailOpenTime(request, response) {
    var date = new Date().toLocaleString();
    var url = request.url || '';
    var info = url.substr(url.indexOf('?') + 1);

    try {
        fs.writeFile('./opentime/detail.log', '\n' + date + ' ' + info, { 'flag': 'a+' },
            error => console.log(error ? 'write failed' : 'write success'));
    } finally {}
}

function handleErrorCode(request, response) {
    var date = new Date().toLocaleString();
    var url = request.url || '';
    var info = url.substr(url.indexOf('?') + 1);

    try {
        fs.writeFile('./errorcode/err.log', '\n' + date + ' ' + info, { 'flag': 'a+' },
            error => console.log(error ? 'write failed' : 'write success'));
    } finally {}
}

function openHtml(pathname, response) {
    try {
        fs.readFile(pathname.substr(1), function(err, data) {
            if (err) {
                console.log(err);
                response.writeHead(404, { 'Content-Type': 'text/html' });
            } else if (pathname.indexOf('html') != -1) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data.toString());
            } else {
                response.writeHead(200, { 'Content-Type': 'image/x-icon' });
                response.write(data);
            }

            response.end();
        });
    } finally {}
}


server.listen(8080);

console.log('Server running at http://localhost:8080/');