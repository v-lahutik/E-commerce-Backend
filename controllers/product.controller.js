import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  try {
    const product = new Product({ name, description, price, category, stock });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  const { name, category } = req.query;
  try {
    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (category) query.category = category;

    const products = await Product.find(query).populate("category");
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

export const deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
