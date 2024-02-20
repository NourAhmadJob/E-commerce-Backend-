// const {promisify} = require('util')
// const User = require('../models/userModels')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs');

// const handleError = (err) => { 
//     console.log(err.message, err.code)
//     let errors = { email: '', password: '' }
    
//     // dublicate error 
//     if (err.code === 11000) { 
//         errors.email = 'This email is already registered'

//         return errors
//     }

//     // validation error 
//     if (err.message.includes('user validation failed')) { 
//         Object.values(err.errors).forEach(({properties}) => { 
//             errors[properties.path] = properties.message;
//         })
//     }
//     return errors;
// }

// const sendToken =   (id) =>  { 
//     const token =  jwt.sign({ id }, 'secret', { expiresIn: 90*60*60 })
        
//     return token;  
// }

// exports.signup = async (req, res, next) => {
//     try { 
//         const email = req.body.email;
//         const password = req.body.password;
//         const user = await User.create({ email, password })
//         const token = sendToken(user._id)
//         return res.status(201).json({
//             status: 'success',
//             token,
//             user, 
//         })
//     } catch (err) { 
//         const errors = handleError(err);
//         // console.log(err)
//         res.status(400).json({ errors })
//         next()
//     }
// }

// exports.login = async (req, res, next) => {
//     try { 
//         const { email, password } = req.body
//         // check if user exist in database
//         const user = await User.findOne({ email })
//         if (!user) { 
//             return res.status(401).json({
//                 status: 'fail', 
//                 message : 'email not found',
//             })
//         }
//         // check if password is correct 
//         const correct = await bcrypt.compare(password , user.password)
//         if (!correct) { 
//             return res.status(401).json({
//                 status: 'fail', 
//                 messsage : 'password is not correct , please try again ...',
//             })
//         }
//         const day = 3 * 24 * 60 * 60
//         const token =  sendToken(user._id)
//         return res.status(200).json({
//             status: 'success', 
//             message: 'logged in successfully',
//             token,
//             user,
//         })
//         // res.send('some data')
//         // Ge}nerate token  and send it
//     } catch (err) { 
//         console.log(err);
//         next();
//     }
// }


// exports.getAllUser = async (req, res, next) => {
//     try { 
//         const users = await User.find();
        
//          res.status(200).json({
//             status: 'success', 
//             message : "get all users successfully",
//             result: users.length,
//             users
//         })
//     } catch (err) { 
//          res.status(400).json({
//             status: 'fail',
//             message : 'Error getting users'
//         })

//         next();
//     }
// }

// exports.protects = async (req, res, next) => { 
//     try { 
//         let token;
//         // Geting token and checking if it's there
//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { 
//                 token =  req.headers.authorization.split(' ')[1]
//         }
//         if (!token) {
//              return res.status(401).json({
//                 status: 'Not authorized',
//                 message : 'You must be logged in to access this'
//             })
//         }
        
//         // Verification token 
//         const decoded = await promisify(jwt.verify)(token, 'secret')
//         console.log(decoded);

        
//         // Checking if user is still exist 
//         const freshUser = await User.findById(decoded.id)

//         if (!freshUser) { 
//             res.status(401).json({
//                 status: 'fail',
//                 message : 'The user belonging to this token does not longer exist'
//             })
//             next();
//         }
//         // Check if user changed password after the token was issued
        
//         next()
//     } catch (err) {
//         console.log(err)
//         if (err.name === 'JsonWebTokenError') res.status(401).json({
//             status: 'fail',
//             message : 'Invalid token , Please Login again ... '
//         })

//         if (err.name === 'TokenExpiredError') res.status(401).json({
//             status: 'fail',
//             message : 'Your token has expired , Please Login again ... '
//         })
//             next();
//      }
// }

// exports.restrictTo = (...roles) => { 
//     return (req, res, next) => { 
//         if (!roles.includes('admin' - 'lead-guide')) { 
//             res.status(403).json({
//                 status: "fail",
//                 message : "You don't have permission to perform this action"
//             })
//             next();
//         }

//     }
// }

// exports.forgotPassword = (req, res, next) => { }
// exports.resetPassword = (req, res, next) => { }