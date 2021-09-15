const { getAllProducts, Product } = require("../models/products.model");

async function getAllProduct(req, res, next) {
  var perPage = 16;
  var page = req.query?.page || 1;
  console.log(`page`, page)
  Product.find() // find tất cả các data
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, products) => {
      Product.countDocuments((err, count) => {
        // đếm để tính có bao nhiêu trang
        if (err) return next(err);
        res.send({
          products, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page
        }); // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
      });
    });
}

module.exports = {
  getAllProduct,
};
