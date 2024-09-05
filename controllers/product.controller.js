import Product from "../models/product.model.js";


export const getProducts = async (req, res) => {
  const { name, category, page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  try {
    const query = {};
    
    if (name) {
      query.name = new RegExp(name, "i"); // Case-insensitive search
    }
 
    if (category) {
      query.category = category;
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Calculate the number of documents to skip
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .skip(skip) 
      .limit(limitNum) 
      .populate("category"); 


    const totalCount = await Product.countDocuments(query);

    res.json({
      totalProducts: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  console.log(req.cookies)
  try {
    const product = new Product({ name, description, price, category, stock, image });
    await product.save();
    res.json(product);
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
