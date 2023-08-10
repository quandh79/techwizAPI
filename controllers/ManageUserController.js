const User = require('../models/users');
const base = require('./baseController');
const Pv = require('../models/userProviderServices')

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
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

exports.getAllUsers = base.getAll(User);


exports.getUser =  async (req, res,next) => {
    try {
        const { id } = req.params;
        console.log(id)
        const doc = await User.findById(id);
        console.log(doc);
        if(!doc){
            res.status(422).json({
                status: 'khong tim tay user',
                
            });
        }
        const data = await Pv.find({userId:doc.id})
        if(!data){
            res.status(422).json({
                status: 'User chua dang ky service',
                
            });
        }
        console.log(data);
        res.status(200).json({
            status: 'success',
            data:{
                doc,
                data
            } 
            
        });
             
  }catch(err){
    next(err)
  };
};

// Don't update password on this 
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);