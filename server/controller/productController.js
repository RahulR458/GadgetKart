const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const multer = require('multer');
const { category } = require('../services/render');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/user/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage }).single('image');


// Create a new product
// exports.create = (req, res) => {

//   upload(req, res, function (err) {
//     if (err) {
//       console.error('File upload error:', err);
//       return res.status(500).json({ error: 'Failed to upload the file' });
//     }

//     if (!req.body) {
//       return res.status(400).json({ error: 'Product details are incomplete' });
//     }

//     const newProduct = new Product({
//       productName: req.body.productName,
//       price: req.body.price,
//       description: req.body.description,
//       category: req.body.category,
//       image: req.body.image
//     });
//     console.log(newProduct.image);
//     newProduct
//       .save(newProduct)
//       .then((product) => {
//         // res.status(201).json(product);
//         res.send(product)
//       })
//       .catch((error) => {
//         console.error('Error creating product:', error);
//         res.status(500).json({ error: 'Failed to create a product' });
//       });
//   });
// };

exports.create = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.error('File upload error:', err);
          return reject('Failed to upload the file');
        }
        resolve();
      });
    });

    if (!req.body) {
      return res.status(400).json({ error: 'Product details are incomplete' });
    }

     // Check for duplicate product name
     const existingProduct = await Product.findOne({ productName: req.body.productName });
     if (existingProduct) {
       return res.status(400).json({ error: 'Product with the same name already exists' });
     }

    // Fetch existing categories
    const categories = await Category.find();
    

    if (categories.length === 0) {
      return res.status(400).json({ error: 'No categories found' });
    }

    // Use the ID of the first category (you can modify this logic)
    const validCategoryId = categories._id;

    const newProduct = new Product({
      productName: req.body.productName,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      stock: req.body.stock,
      image: req.body.image,
    });

    const product = await newProduct.save();
    // res.status(201).json(product);
    res.redirect("/adminLogin/addProduct")
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create a product' });
  }
};



// // Your route to handle product creation, assuming you receive the category ID in the request.
// exports.createProduct = async (req, res) => {
//   try {
//     const categoryId = req.body.categoryId; // Get the category ID from the request
//     console.log(req.body);
//     // Create a new product
//     const product = new Product({
//       productName: req.body.productName,
//       price: req.body.price,
//       description: req.body.description,
//       category: categoryId, // Set the category field to the category ID
//       image: req.body.image
//     });

//     // Save the product

//     // await product.save();

//     // Find the category and push the product's ID into its products array
//     const category = await Category.findById(categoryId);
//     category.products.push(product._id);
//     await category.save();

//     // res.status(201).json(product);
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ error: 'Failed to create a product' });
//   }
// };



exports.list = async (req, res) => {
  try {
    const product = await Product.find()
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "data to update can not be empty!" });
  }

  const id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
          if (!data) {
              res.status(404).send({ message: "user not found" });
          } else {
              res.send(data);
          }
      })
      .catch((err) => {
          res.status(500).send({ message: "error update user information" });
      });

};



