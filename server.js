const server = require('http').createServer();
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const templateEngine = require('./engine/templateEngine');

// Terminal Color Codes
const color = {
  SUCCESS: '\033[92m',
  DANGER: '\033[91m',
  END: '\033[0m',
  BOLD: '\033[1m',
  YELLOW: '\033[93m',
};

// Synchronous File Reads
const tempIndex = fs.readFileSync(`${__dirname}/templates/index.html`, 'utf-8');
const tempTodo = fs.readFileSync(`${__dirname}/templates/todo.html`, 'utf-8');

// Our So Called Api Request
const rawData = fs.readFileSync(`${__dirname}/database/data.json`, 'utf-8');
const dataObj = JSON.parse(rawData);

server.on('request', (req, res) => {
  const url = req.url;

  if (url === '/') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    console.log(
      color.BOLD +
        color.SUCCESS +
        `GET "${url}" \t\t\t ✅ ${res.statusCode} on ` +
        moment().format('h:mm:ss a') +
        color.END
    );
    const todos = dataObj.map((el) => templateEngine(el, tempTodo)).join('');
    output = tempIndex.replace('{%TODOS%}', todos);
    res.end(output);
  } else if (url === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    console.log(
      color.BOLD +
        color.SUCCESS +
        `GET "${url}" \t\t\t ✅ ${res.statusCode} on ` +
        moment().format('h:mm:ss a') +
        color.END
    );
    res.end(rawData);
    // Static Files AutoRender
  } else {
    const extname = path.extname(url);
    let contentType = 'text/html';
    switch (extname) {
      case '.css':
        contentType = 'text/css';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
      case '.jpeg':
        contentType = 'img/jpg';
        break;
    }
    fs.readFile(`${__dirname}/templates/${url}`, 'utf-8', (err, data) => {
      if (err) {
        if (err.code == 'ENOENT') {
          res.writeHead(404);
          console.log(
            color.BOLD +
              color.DANGER +
              `GET "${url}" \t\t\t ❌ ${res.statusCode} on ` +
              moment().format('h:mm:ss a') +
              color.END
          );
          res.end('<h1> 404 PAGE NOT FOUND </h1>');
        } else {
          res.writeHead(500);
          console.log(
            color.BOLD +
              color.DANGER +
              `GET "${url}" \t\t\t ❌ ${res.statusCode} on ` +
              moment().format('h:mm:ss a') +
              color.END
          );
          res.end('<h1> INTERNAL SERVER ERROR </h1>');
        }
      } else {
        res.writeHead(200, {
          'content-type': contentType,
        });
        console.log(
          color.BOLD +
            color.SUCCESS +
            `GET "${url}" \t\t\t ✅ ${res.statusCode} on ` +
            moment().format('h:mm:ss a') +
            color.END
        );
        res.end(data);
      }
    });
  }
});

server.listen(8000, 'localhost', () => {
  console.log(
    color.BOLD +
      color.YELLOW +
      'SERVER RUNNING ON PORT 8000 🌍 ' +
      moment().format('dddd, MMMM Do YYYY, h:mm:ss a') +
      color.END +
      '\n'
  );
});
