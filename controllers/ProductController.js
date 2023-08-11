const Product = require("../models/product");
const Provider = require("../models/streamingProviders")

exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, providers } = req.body;
    const c = await Product.findOne({ name });
    if (c) {
      return res.status(403).json({ message: "Channel is exist" });
    }
    const data = await Product.create({
      name,
      category,
      description,
      providers,
      thumbnail,
    });
    res.status(201).json({
      message:"tao chanel thanh cong"
    })
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
exports.getProduct = async (req, res) => {
  try {
    const { search } = req.body;
    if (search) {
      console.log(search);
      const data = await Product.find({
        $or: [
          { name: new RegExp(search, "i") },
          {
            category: new RegExp(search, "i"),
          },
        ],
      });
      if (!data) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json(data);
    }

    const data = await Product.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};


exports.getProductProviders = async (req, res) => {
  try {
    const { productId } = req.body;
console.log(productId)
    // Tìm thông tin sản phẩm
    const product = await Product.findById(productId);
    console.log(product)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Lấy danh sách các nhà cung cấp từ thuộc tính 'providers' của sản phẩm
    const providers = product.providers;
    var id = []
    var service = []
    await Promise.all(providers.map(async (item) => {
      service.push(item.service);
      id.push(item.id);
    }));
    
    console.log(id)
    console.log(service);
    const pro = await Provider.find({_id:{$in:providerIds['id']}})
    // providerIds.map(async item=>{
    //   return(
    //      pro = await Provider.findA(item)
      
    //     )
       
    // })
   
  
  console.log(pro)
      // const providers = await Provider.find({
      //   _id: { $in: providerIds },
      // });
      // console.log("okkkkkk",providers)
      // if (!providers || providers.length === 0) {
      //   return res.status(422).json({
      //     message: "No providers found",
      //   });
      // }
    return res.status(200).json({
      providers: providers,
    });
  } catch (error) {
    return res.status(422).json(error.message);
  }
};