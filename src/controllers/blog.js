const { json } = require("body-parser");
const { validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const BlogPost = require('../models/blog');

exports.createBlogPost = (req, res, next)=> {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const err = new Error('Input value tidak sesuai');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err
    }
    if(!req.file) {
        const err = new Error('Image harus diupload');
        err.errorStatus = 422;
        throw err
        
    }

    // menerima
    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;


    const posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {uid: 1, name: 'Daffa Akbar'}
    })

    posting.save()
    .then(result => {
        res.status(201).json({
            message: 'Create Blog Post Success',
            data: result
        });
    })
    .catch(err => {
        console.log('err :', err);
    });

}

exports.getAllBlogPost = (req, res, next) => {
    // Pagination hal 1 dan perpage 5
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;
    // menghitung jumlah data
    BlogPost.find()
    .countDocuments()
    .then(count=> {
        totalItems = count;
        return BlogPost.find()
        // data yg di lewati
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Blog berhasil di Panggil',
            data: result,
            total_data: totalItems,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch( err =>{
        next(err);
    })


}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
    .then( result => {
        if(!result) {
            const error = new Error('Blog Post tidak ditemukan!');
            error.errorStatus = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Data Berhasil ditemukan',
            data: result
        })
    })
    .catch( err => {
        next(err);
    })

}
exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const err = new Error('Input value tidak sesuai');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err
    }
    if(!req.file) {
        const err = new Error('Image harus diupload');
        err.errorStatus = 422;
        throw err
        
    }

    // menerima
    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const postId =req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error('Blog Post tidak ditemukan')
            err.errorStatus = 404;
            throw err;
        }
        post.title = title;
        post.body = body;
        post.image = image;

        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: "Update Blog Post Berhasil!",
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}
exports.deleteBlogPost = (req, res, nex) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if (!post) {
            const err = new Error('Blog Post tidak ditemukan');
            err.errorStatus = 400;
            throw err
        }
        removeImage(post.image);
        return BlogPost.findByIdAndRemove(postId)
    })
    .then(result =>{
        res.status(200).json({
            message: 'Delete Blog Post Berhasil',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })

}
const removeImage = (filePath) => {
    console.log('filePath', filePath);
    console.log('dir name: ', __dirname);

    filePath = path.join(__dirname, '../..', filePath);
    fs.unlink(filePath, err => console.log(err));
}