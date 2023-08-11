const base = require('./baseController');
const Sp = require('../models/streamingProviders')

exports.getAllStreamProvider = base.getAll(Sp);
exports.Create = async (req, res, next) => {
    try {
        const { name } = req.body;
        const n = await Sp.findOne({name: name});
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
       

exports.getOne = base.getOne(Sp);
exports.Update = async (req, res, next) => {
    try {
        const { name } = req.body;
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
