import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { roleCheck } from '../middlewares/roleCheck.js';


const productRouter=express.Router();

productRouter.route('/')
.get(getProducts)
.post(roleCheck(['admin']),createProduct)

productRouter.route('/:id')
.put(roleCheck(['admin']),updateProduct)
.delete(roleCheck(['admin']),deleteProduct)

export default productRouter;