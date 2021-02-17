const express = require('express');

const app = express();

app.use( ()=>{
    console.log('server')
})

app.listen(4000);
