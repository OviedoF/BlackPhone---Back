const path = require('path');
const express = require('express');
const router = express.Router();
const blogController = require(path.join(__dirname, '..', 'controllers', 'blog.controller'));

router.get('/', blogController.getBlogEntries);

router.get('/:id', blogController.getBlogEntry);

router.get('/title/:title', blogController.getBlogByTitle);

router.post('/', blogController.createBlogEntry);

router.put('/:id', blogController.updateBlogEntry);

router.delete('/:id', blogController.deleteBlogEntry);

module.exports = router;