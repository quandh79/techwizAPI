const base = require('./baseController');
const Sp = require('../models/streamingProviders')

exports.getAllStreamProvider = base.getAll(Sp);
exports.Create = base.createOne(Sp);
exports.getOne = base.getOne(Sp);
exports.Update = base.updateOne(Sp);
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