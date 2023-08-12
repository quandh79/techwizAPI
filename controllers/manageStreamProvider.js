const base = require('./baseController');
const Sp = require('../models/streamingProviders');

exports.getAllStreamProvider = base.getAll(Sp);

exports.Create = async (req, res, next) => {
    try {
        const { name } = req.body;
        console.log(req.body);
        const n = await Sp.findOne({name: name});
        if(!Sp){
            return res.status(422).json({
                message: "Nha cung cap da ton tai"
            });
        }
        const file = req.files;
        const sp = await Sp.create({
          name: name,
          description: req.body.description,
          thumbnail:"/uploads/streamprovider/"+file.thumbnail.name,
          packages: req.body.packages ?req.body.packages:[]
        });
       return res.status(201).json({
            sp,
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

        const c = await Sp.findById(id);
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
       

exports.getOne = base.getOne(Sp);
exports.Update = async (req, res, next) => {
    try {
        const { name } = req.body;
        console.log(req.body)
        const n = Sp.findOne({name: name});
        if(sp){
            req.status(422).json({
                message: "Nha cung cap da ton tai"
            });
        }
        
        const sp = await Sp.create({
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
            await Sp.findByIdAndUpdate(req.params.id, {
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
