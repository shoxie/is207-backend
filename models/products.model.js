const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  snippet: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  howToCook: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    validate: {
      validator: function (val) {
        const currMax = 5;
        return currMax !== undefined ? val <= currMax && currMax >= val : true;
      },
      message: "The MIN range with value {VALUE} must be in range of [0, 5]!",
    },
  },
  sku: {
    type: String,
    required: true,
  },
  freshNess: {
    type: String,
    enum: ["fresh", "expired"],
  },
  farm: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true,
    enum: ["inStock", "outOfStock"],
  },
  quantity: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },

  tags: [
    {
      type: Schema.Types.String,
      ref: "Tag",
      key: "name",
    },
  ],
});

var Product = mongoose.model("Products", productsSchema);

const createOneProduct = (product) => new Product(product).save();

const getOneProduct = (id) => Product.findById(id);

const reduceQuantity = (id) =>
  Product.findByIdAndUpdate(id, { $inc: { quantity: -1 } });

const increaseQuantity = (id) =>
  Product.findByIdAndUpdate(id, { $inc: { quantity: 1 } });

const getAllProducts = async (perPage, page) => {
  var data = await Product.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, products) => {
      Product.countDocuments((err, count) => {
        if (err) return err;
        return products;
      });
    });
  console.log(data);
  return data;
};

module.exports = {
  createOneProduct,
  getOneProduct,
  reduceQuantity,
  increaseQuantity,
  getAllProducts,
  Product,
};
