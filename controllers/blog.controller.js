const { Category } = require("../models/category.model");
const prisma = require("../models/index");

async function getBlogs(req, res, next) {
    let { id } = req.query || undefined;
    if (id) {
        prisma.blog
            .findOne({
                where: {
                    id: id,
                },
            })
            .then((blog) => {
                res.status(200).json(blog);
            })
            .catch((err) => res.status(400).send({ message: err.message }));
    } else {
        prisma.blog
            .findMany()
            .then((blogs) => {
                res.status(200).json(blogs);
            })
            .catch((err) => res.status(400).send({ message: err.message }));
    }
}
async function createBlog(req, res, next) {
    const { title, content, category, imgUrl, subHeading = null, author = null } = req.body;
    prisma.blog
        .create({
            data: {
                title: title,
                content: content,
                category: category,
                imgUrl: imgUrl,
                subHeading: subHeading,
                author: author === null ? 'Anonymous' : author,
            },
        })
        .then((blog) => {
            res.status(200).json(blog);
        })
        .catch((err) => res.status(400).send({ message: err.message }));
}
module.exports = {
    getBlogs,
    createBlog
};
