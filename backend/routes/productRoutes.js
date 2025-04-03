const express =require("express");
const Product = require("../model/Product");
const {protect,admin} = require("../middleware/authMiddleware");


const router = express.Router();


// đăng ký sản phẩm
router.post("/",protect,admin,async(req,res)=>{
    try{
        const {name,
            description
            ,price,
            discountPrice,
            countItStock,
            category,
            brand,sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        } = req.body;
        const product = new Product({
            name,
            description
            ,price,
            discountPrice,
            countItStock,
            category,
            brand,sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user:req.user._id,}
        );
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch(error) {
        console.error(error)
        res.status(500).send("Lỗi máy chủ");
    }
});


router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const {name,
            description
            ,price,
            discountPrice,
            countItStock,
            category,
            brand,sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        } = req.body;

        // Id
        const product = await Product.findById(req.params.id)
        if(product){
            // update
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice =  discountPrice || product.discountPrice;
            product.countItStock =  countItStock || product.countItStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender =  gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished: product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // save
            const updatedProduct =  await product.save();
            res.json(updatedProduct);
        }
        else{
            res.status(404).json({message:"Không tìm thấy sản phẩm"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
})

// delete

router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message:"Sản phẩm đã bị xóa"});
        }else{
            res.status(401).json({message:"Không tìm thấy sản phẩm ?"})
        }
    } catch (error) {
        console.error(error);
        re.status(500).send("Lỗi máy chủ");
    }
})


// lấy tất cả sản phẩm

router.get("/",async(req,res)=>{
    try {
        const {collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit
        } = req.query;
        let query ={};

        // fill
        if(collection  && collection.toLocaleLowerCase() !== "all"){
            query.collections = collection;
        }

        if(category  && category.toLocaleLowerCase() !== "all"){
            query.category = category;
        }
        if(material){
            query.material = {$in:material.split(",")};
        }
        if(brand){
            query.brand = {$in:brand.split(",")};
        }
        if(size){
            query.sizes = {$in:size.split(",")};
        }
        if(color){
            query.colors = {$in:[color]};
        }
        if(gender){
            query.gender = gender;
        }
        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice);
            if(maxPrice) query.price.$lte = Number(maxPrice);
        }
        if(search){
            query.$or =[
                {name:{$regex:search,$options:"i"}},
                {description:{$regex: search,$options:"i"}},
            ];
        }

        // sort logic
        let sort ={};
        if(sortBy){
            switch (sortBy){
                case "priceAsc":
                    sort = {price:1};
                    break;
                case "priceDesc":
                    sort = {price:-1};
                    break;
                case "popularity":
                    sort = {rating: -1};
                    break;
                default:
                    break;
            }
        }

        // 
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
})

// best seller

router.get("/best-seller",async(req,res)=>{
    try {
      const bestSeller = await Product.findOne().sort({rating: -1});
      if(bestSeller){
        res.json(bestSeller);

      }else{
        res.status(404).json({message:"Không tìm thấy sản phẩm bán chạy nhất"});
      }
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
})

// 
router.get("/new-arrivals",async(req,res)=>{
    try {
        const newArrivals = await Product.find().sort({createdAt:-1}).limit(8);
        res.json(newArrivals);

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ");
    }
})

// này là lấy id của 1 sản phẩm
router.get("/:id",async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        } else {
            console.error(error);
        res.status(500).send("Lỗi máy chủ");
        }
    } catch (error) {   
       
    }
})


// similar/id
router.get("/similar/:id",async(req,res)=>{
    const {id} = req.params;
   try {
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({message:"Không tìm thấy sản phẩm"})
    }

    const similarProducts = await Product.find({
        _id:{$ne:id},
        gender:product.gender,
        category:product.category,
    }).limit(4);
    res.json(similarProducts);
   } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi máy chủ");
   }
})




module.exports = router;