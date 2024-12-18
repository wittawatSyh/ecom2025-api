const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) =>{
    try {
        //code
        const { email, password } = req.body

        // Step 1 Validate body
        if(!email) {
        return res.status(400).json({ message : "Email is required!!"})
        }

        if(!password) {
            return res.status(400).json({ message :"password is required!!"})
        }

        // Step 2 Check Email in DB already ?
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(user) {
            return res.status(400).json({ message : "Email already Exits!!"})
        }
        
        // Step 3 HashPassword
        const hashPassword = await bcrypt.hash(password,10)
        
        // Step 4 Register
        await prisma.user.create({
            data:{
                email:email,
                password:hashPassword
            }
        })

        res.send('Register Sussess')
    } catch (error) {
        //err
        console.log(err);
        res.status(500).json({ message: "Server Error"})
    }
}

exports.login = async (req, res) =>{
    try {
        //code
        const { email, password } = req.body
        // Step 1 Chack email
        const  user = await prisma.user.findFirst({
            where:{
                email:email
            }
        })
        if(!user || !user.enabled){
            return res.status(400).json({ message:"User Not found or not Enabled"})
        }
        // Step 2 Chack password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:'Password Invalid!!'})
        }
        // Step 3 Chack payload
        const payload = {
            id : user.id,
            email:user.email,
            role:user.role
        }
        // Step 4 Chack generate Token
        jwt.sign(payload,process.env.SECRET,{
            expiresIn:'1d'
        },(err,token)=>{
            if(err){
                return res.status(500).json({message: 'Server Error'})
            }
            res.json({payload, token})
        })

    } catch (err) {
        //err
        console.log(err);
        res.status(500).json({ message: "Server Error"})
    }
}

exports.currentUser = async (req, res) =>{
    try {
        //code
        const user = await prisma.user.findFirst({
            where:{ email: req.user.email },
            select: {
                id:true,
                email:true,
                name:true,
                role:true
            }
        })
        res.json({user})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message : "Server Error"})
    }
}


