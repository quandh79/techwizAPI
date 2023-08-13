const base = require('./baseController');
const StreamingProvider = require('../models/streamingProviders');

exports.getAllStreamProvider = async (req,res,next)=>{
    try {
        const providersWithPackages = await StreamingProvider.find({});
        res.status(200).json(providersWithPackages);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    };





exports.Create = async (req, res, next) => {
    try {
        const { name } = req.body;
        console.log(req.body);
        const provider = await StreamingProvider.findOne({name: name});
        if(provider){
            return res.status(422).json({
                message: "Nha cung cap da ton tai"
            });
        }
       
        const data = await StreamingProvider.create({
          name: name,
          description: req.body.description,
          thumbnail:req.body.thumbnail?req.body.thumbnail:undefined,
          packages: req.body.packages ?req.body.packages:[]
        });
       return res.status(201).json({
            data,
            status: "success",
            message: "Tao nha cung cap thanh cong",
          });
    }catch(err){
        err.message
    }
};

exports.uploadFile = async (req,res, next) => {
    try {
        const { id } = req.params;
        console.log(id)
        const file = req.file;
        console.log(file)

        const c = await StreamingProvider.findById(id);
        console.log(c)
        if(!c){
            return res.status(422).json({
                message:"not found"
            })
        }
        if(file) 
        c.thumbnail =  "/uploads/streamprovider/"+file.thumbnail.name;
        await c.save();
        return res.status(200).json({
            c
        })
    }catch(err){
        res.status(500).json({
            message:(err)
        })
    }
}
       

exports.getOne = base.getOne(StreamingProvider);
exports.Update = async (req, res, next) => {
    try {
        const { name } = req.body;
        console.log(req.body)
        const n = StreamingProvider.findOne({name: name});
        if(sp){
            req.status(422).json({
                message: "Nha cung cap da ton tai"
            });
        }
        
        const sp = await StreamingProvider.create({
          name: name,
          description: req.body.description,
          thumbnail: req.file ? req.file.path : null,
          packages: req.body.packages ?req.body.packages:[]
        });
        res.status(200).json({
            status: "success",
            message: "Tao nha cung cap thanh cong",
          });
    }catch(err){
        next(err)
    }
} 



exports.deleteMe = async (req, res, next) => {
        try {
            await StreamingProvider.findByIdAndUpdate(req.params.id, {
                active: false
            });
    
            res.status(204).json({
                status: 'success',
                data: null
            });
    
    
        } catch (error) {
            next(error);
        }
    };
