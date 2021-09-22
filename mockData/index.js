const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
fs = require("fs");
var data = {
  category: {
    connectOrCreate: {
      create: {
        name: "Organic",
        description: "Organic products are the best",
      },
      where: {
        id: "6149807b00e62e0f0017bba5",
      },
    },
  },
  description:
    "Carrots from Tomissy Farm are one of the best on the market. Tomisso and his family are giving a full love to his Bio products. Tomisso’s carrots are growing on the fields naturally.",
  farm: "Grocery Tarm Fields",
  freshNess: "fresh",
  howToCook:
    "Carrots from Tomissy Farm are one of the best on the market. Tomisso and his family are giving a full love to his Bio products. Tomisso’s carrots are growing on the fields naturally.",
  image:
    "https://santorino.org/wp-content/uploads/2020/05/ca-rot-baby-baby-carrots-e1588671104217.jpg",
  name: "Carrots from Tomissy Farm",
  origin: "Czech Republic",
  price: 100,
  quantity: 100,
  rating: 4,
  salePrice: 4,
  sku: "76641",
  snippet:
    "Carrots from Tomissy Farm are one of the best on the market. Tomisso and his family are giving a full love to his Bio products. Tomisso’s carrots are growing on the fields naturally.",
  stock: "inStock",
};
async function main() {
  var name = "data.json";
  var dataFile = JSON.parse(fs.readFileSync(name).toString());

  var args = process.argv.slice(2);
  if (args[0] === "--trim") {
    dataFile.forEach(function (p) {
      if (p.id) delete p.id;
      p.price = parseInt(p.price);
      p.salePrice = parseInt(p.salePrice);
      p.categoryId = "6149807b00e62e0f0017bba5"
    });
    fs.writeFileSync(name, JSON.stringify(dataFile));
  }
  if (args[0] === "--import") {
    dataFile.forEach(async function (p) {
      await prisma.product
        .create({
          data: p,
        })
        .then(() => console.log("Product created"))
        .catch((e) => console.log(e));
    });
  }
  // prisma.product.create({ data: data }).then(() => console.log(1));
  // ... you will write your Prisma Client queries here
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
