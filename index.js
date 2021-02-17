const express = require('express');

const app = express();
const router = express.Router();

//Semua method
router.use('/products', (req,res, next)=> {
    // console.log('url: ', req.originalUrl);
    // console.log('method: ', req.method);
    res.json({name: "Daffa Akbar", email: "da@gmail.com"})
    next();
})
router.use('/price', (req,res, next)=> {
    res.json({price: 300000})
    next();
})
//Hanya method GET
router.get('/customers', (req,res, next) => {
    res.json({title: "Customer"})
    next();
})

app.use('/', router);

app.listen(4000);
