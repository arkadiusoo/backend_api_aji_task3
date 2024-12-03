const db = require("../models");
const Product = db.products;

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
