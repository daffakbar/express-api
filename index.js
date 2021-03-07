const express = require('express');
const bodyParser = require('body-parser');
//Connect MongoDB
const mongoose = require('mongoose');
const uri = "mongodb+srv://daffa:5solikin@cluster0.9wqvd.mongodb.net/blog?retryWrites=true&w=majority";
// handle form-data
const multer = require('multer'); 
// handle req image
const path = require('path');

const app = express();
// const productRoutes = require('./src/routes/products')
const authRoutes = require('./src/routes/auth')
const blogRoutes = require('./src/routes/blog');

// handle form-image
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true)
    } else {
        cb(null, false)
    }
}
// config
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// app.use('/v1', productRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

//handle error
app.use((error, req, res, next) =>{
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    })
});


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   app.listen(4000, () => console.log('Koneksi sukses'));

//   client.close();
// });

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
    app.listen(4000, () => console.log('Koneksi sukses'));

})
.catch(err => console.log(err));

