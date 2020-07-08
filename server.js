const http = require('http');
const fs = require('fs');

// Synchronous File Reads
const tempIndex = fs.readFileSync(`${__dirname}/templates/index.html`, 'utf-8');
const tempTodo = fs.readFileSync(`${__dirname}/templates/todo.html`, 'utf-8');
const rawData = fs.readFileSync(`${__dirname}/database/data.json`, 'utf-8');
const dataObj = JSON.parse(rawData);

const templateEngine = (data, temp) => {
  let output = temp.replace(/{%TODO_TITLE%}/g, data.title);
  if (data.completed) {
    output = output.replace(/{%IS_COMPLETE%}/g, 'done');
    output = output.replace(/{%IS_COMPLETE_IMG%}/g, '✅');
  } else {
    output = output.replace(/{%IS_COMPLETE%}/g, '');
    output = output.replace(/{%IS_COMPLETE_IMG%}/g, '❌');
  }
  return output;
};

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/') {

    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const todos = dataObj.map((el) => templateEngine(el, tempTodo)).join('');
    output = tempIndex.replace('{%TODOS%}', todos);
    res.end(output);

  } else if (url === '/api') {

    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(rawData);

  } else {

    res.writeHead(404);
    res.end('<h1> 404 PAGE NOT FOUND </h1>');
    
  }
});

server.listen(5000, '127.0.0.1', () => {
  console.log('SERVER RUNNING ON PORT 8000 🌍');
});
