const path = require('path');
const BlogEntry = require(path.join(__dirname, '..', 'models', 'BlogEntry.model'));
require('dotenv').config();

const blogController = {};

blogController.getBlogEntries = async (req, res) => {
    try {
        const { page } = req.query;

        if (page) {
            const blogEntries = await BlogEntry.find().populate('similars').sort({ createdAt: -1 }).limit(10).skip((page - 1) * 10);

            res.status(200).json({
                status: true,
                message: 'Blog entries retrieved successfully',
                blogEntries
            });
        } else {
            const blogEntries = await BlogEntry.find().populate('similars').sort({ createdAt: -1});

            res.status(200).json({
                status: true,
                message: 'Blog entries retrieved successfully',
                blogEntries
            });
        }
    } catch (error) {
        res.status(400).json({
            message: 'An error occurred while trying to get the blog entries',
            error
        });
    }
}

blogController.getBlogEntry = async (req, res) => {
    try {
        const { id } = req.params;

        const blogEntry = await BlogEntry.findById(id).populate('similars');

        res.status(200).json({
            status: true,
            message: 'Blog entry retrieved successfully',
            blogEntry
        });
    } catch (error) {
        res.status(400).json({
            message: 'An error occurred while trying to get the blog entry',
            error
        });
    }
}

blogController.getBlogByTitle = async (req, res) => {
    try {
        const { title } = req.params;

        const blogEntry = await BlogEntry.findOne({ title }).populate('similars');

        res.status(200).json({
            status: true,
            message: 'Blog entry retrieved successfully',
            blogEntry
        });
    } catch (error) {
        res.status(400).json({
            message: 'An error occurred while trying to get the blog entry',
            error
        });
    }
}

blogController.createBlogEntry = async (req, res) => {
    try {
        if (req.files && req.files.images) {
            const { images } = req.files;
            const image = `${process.env.BASE_URL}/uploads/${images[0].filename}`;
            req.body.image = image || '';
        }

         const newBlogEntry = new BlogEntry({
             ...req.body,
             tags: req.body.tags.split(',').map(tag => tag.trim()),
             similars: req.body.similars ? req.body.similars.split(',').map(similar => similar.trim()) : []
         });

         await newBlogEntry.save();

        res.status(201).json({
            status: true,
            message: 'Blog entry created successfully',
            blogEntry: newBlogEntry
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'An error occurred while trying to create the blog entry',
            error
        });
    }
}

blogController.updateBlogEntry = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.files && req.files.images) {
            const { images } = req.files;
            req.body.image = `${process.env.BASE_URL}/uploads/${images[0].filename}` || '';
        }

        console.log(req.body);

        const updatedBlogEntry = await BlogEntry.findByIdAndUpdate(id, {
            ...req.body,
            tags: req.body.tags.split(',').map(tag => tag.trim()),
            similars: req.body.similars ? req.body.similars.split(',').map(similar => similar.trim()) : []
        }, { new: true });

        res.status(200).json({
            status: true,
            message: 'Blog entry updated successfully',
            blogEntry: updatedBlogEntry
        });
    } catch (error) {
        res.status(400).json({
            message: 'An error occurred while trying to update the blog entry',
            error
        });
    }
}

blogController.deleteBlogEntry = async (req, res) => {
    try {
        const { id } = req.params;

        await BlogEntry.findByIdAndDelete(id);

        res.status(200).json({
            status: true,
            message: 'Blog entry deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: 'An error occurred while trying to delete the blog entry',
            error
        });
    }
}

module.exports = blogController;