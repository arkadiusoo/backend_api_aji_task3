const db = require("../models");
const Product = db.products;
const csv = require("csv-parser");
const { Readable } = require("stream");

// show all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};
// show product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};
// adding new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price_unit, weight_unit, category } = req.body;

    // validation input data
    if (
      !name ||
      !category ||
      price_unit === undefined ||
      weight_unit === undefined
    ) {
      return res.status(400).json({
        message:
          "Fields name, price_unit, weight_unit, and category are required.",
      });
    }

    if (price_unit <= 0) {
      return res.status(400).json({
        message: "price_unit must be greater than zero.",
      });
    }
    if (weight_unit <= 0) {
      return res.status(400).json({
        message: "weight_unit must be greater than zero.",
      });
    }

    const newProduct = await Product.create({
      name,
      description: description || "",
      price_unit,
      weight_unit,
      category,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product.",
      error: error.message,
    });
  }
};

// changing existing product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_unit, weight_unit, category } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // validation input data
    if (price_unit <= 0) {
      return res.status(400).json({
        message: "price_unit must be greater than zero.",
      });
    }
    if (weight_unit <= 0) {
      return res.status(400).json({
        message: "weight_unit must be greater than zero.",
      });
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price_unit: price_unit !== undefined ? price_unit : product.price_unit,
      weight_unit:
        weight_unit !== undefined ? weight_unit : product.weight_unit,
      category: category || product.category,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product.",
      error: error.message,
    });
  }
};

exports.initializeProducts = async (req, res) => {
  try {
    const productCount = await Product.count();
    if (productCount > 0) {
      return res
        .status(409)
        .json({ message: "Products already exist in the database." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }

    const extension = file.originalname.split(".").pop().toLowerCase();
    let products = [];

    if (extension === "json") {
      const jsonData = JSON.parse(file.buffer.toString());
      products = Array.isArray(jsonData) ? jsonData : [];
    } else if (extension === "csv") {
      // Parsowanie CSV z bufora
      const readable = new Readable();
      readable._read = () => {}; // No-op
      readable.push(file.buffer);
      readable.push(null);

      const csvData = [];
      await new Promise((resolve, reject) => {
        readable
          .pipe(csv())
          .on("data", (row) => csvData.push(row))
          .on("end", () => {
            products = csvData;
            resolve();
          })
          .on("error", reject);
      });
    } else {
      return res.status(400).json({
        message: "Unsupported file format. Only JSON and CSV are supported.",
      });
    }

    // data validation
    const validProducts = products.filter(
      (product) =>
        product.name &&
        product.description &&
        product.price_unit > 0 &&
        product.weight_unit > 0 &&
        product.category
    );

    if (validProducts.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid products found in the file." });
    }

    await Product.bulkCreate(validProducts);

    res.status(200).json({ message: "Products successfully initialized." });
  } catch (error) {
    console.error("Error initializing products:", error.message);
    res
      .status(500)
      .json({ message: "Error initializing products.", error: error.message });
  }
};
