
const Category = require('../model/categoryModel');
const multer = require('multer');




// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/user/images'); // Specify the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Define the filename for the uploaded file
  },
});

const upload = multer({ storage: storage }).single('categoryImage'); // Use 'categoryImage' to match your HTML form field name

exports.create = (req, res) => {
  // Use the `upload` middleware to handle the file upload
  upload(req, res, async function (err) {
    if (err) {
      // Handle file upload error
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to upload the file' });
    }

    // Now, you can handle other form fields and save the image details to MongoDB
    if (!req.body) {
      return res.status(400).json({ message: 'Content cannot be empty!' });
    }

    if(!req.body.categoryDescription){
      return res.status(400).json({message:"Category Description is required!"})
    }
    
    if(!req.body.categoryImage){
      return res.status(400).json({message:"Category Image is required!"})
    }

    const categories = await Category.find({categoryName:req.body.categoryName});
    console.log(categories+"....categories");
    console.log(req.body.categoryName+"........req.body.categoryName");
    // console.log(categories[0].categoryName+"....categories.categoryName");
    if(req.body.categoryName === categories.categoryName){
      return res.status(400).json({message:"Category Name is already exist!"})    
    }
 
    const category = new Category({
      categoryName: req.body.categoryName,
      categoryDescription: req.body.categoryDescription,
      categoryImage: req.body.categoryImage, // Use req.file.filename to get the uploaded file's name
    });

    category
      .save()
      .then((data) => {
        res.redirect('/adminLogin/addCategory');
      })
      .catch((error) => {
        console.error('Error creating category:', error);
        res.status(400).json({ error: 'Failed to create a category' });
      });
  });
};


// // Get a list of categories
exports.list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

// Update a category by ID
exports.update = async (req, res) => {
  console.log("akhil");
  if (!req.body) {
    return res.status(400).send({ message: "data to update can not be empty!" });
  }

  const id = req.params.id;
  console.log(req.params.id+"...req.params.id");
  Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

// Delete a category by ID
// exports.delete = async (req, res) => {
//   try {
//     await Category.findByIdAndDelete(req.params.id);
//     res.status(204).send();
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to delete category' });
//   }
// };



