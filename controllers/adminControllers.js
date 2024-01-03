const User = require("../models/userModel")
const createError = require("../middlewares/createError")
const Joi = require("joi")
const bcrypt = require("bcrypt")


const adminLogin = async (req , res , next) => {

    try {
       
        const adminLoginSchema = Joi.object({
            email : Joi.string().required().not().empty().email() ,
            password : Joi.string().not().empty().min(8)
        })

       const {error , value} = adminLoginSchema.validate(req.body)

       if(error) return next(createError(404 , "Invalid Credentials"))

        const {email , password} = value

        const adminUser = await User.findOne({email}).select("+password")

        if(!adminUser) return next(createError(404 , "Invalid Credentials"))

        if(!adminUser.isAdmin) return next(createError(401 , "Access denied , admins only"))

        const isPasswordMatched = await bcrypt.compare(password , adminUser.password)

        if(!isPasswordMatched) return next(createError(400 , "Invalid Credentials"))

        const token = adminUser.createJWT()

        adminUser.password = undefined

        res.status(200).json({adminUser , token})

    } catch (error) {
        next(error)
    }
}




const createUser = async (req , res , next) => {
    try {
        const newUser = new User(req.body)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newUser.password , salt)
        newUser.password = hashedPassword
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}




const deleteUser = async (req , res , next) => {
    try {
        const {userId} = req.params
        await User.findByIdAndDelete(userId)
        res.status(200).json({msg : "user deleted successfully"})
    } catch (error) {
        next(error)   
    }
}




const updateUser = async (req , res , next) => {
    try {
        const {userId} = req.params
        
        const hashedPassword = await bcrypt.hash(req.body.password , 10)

        const user = await User.findByIdAndUpdate(userId , {...req.body , password : hashedPassword} , {new : true})
        
        res.status(200).json(user)        
    } catch (error) {
        next(error)
    }
}




const getUsersByAdmin = async (req , res , next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}




const getUserById = async (req , res , next) => {
    try {
        const {userId} = req.params

        const user = await User.findOne({_id : userId})

        if(!user){
            return next(createError(404 , "User with id not exist"))
        }

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}


module.exports = {adminLogin , deleteUser , updateUser , createUser , getUsersByAdmin , getUserById}