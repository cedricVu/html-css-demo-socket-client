const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 3002;

app.use(express.static('public'));

http.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
