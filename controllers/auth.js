import mongoose from 'mongoose'
import {User} from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET =process.env.JWT_SECRET


export const register = async (req, res) => {
    const {name, password} = req.body

    if (!name || typeof name != 'string') {
        return res.status(404).json({message: 'non valido'})
    }

    if (!password || typeof password != 'string') {
        return res.status(404).json({message: 'password non valida'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        name: name,
        password:hashedPassword
    })
    try {
        await user.save()
        res.status(201).json({message: `utente ${name} registrato`})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const login = async (req, res)=> {
    const {name, password} = req.body

    const user = await User.findOne({name});

    if (!user) {
        return res.status(404).json({message: 'credenziali errate'})

    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            name: user.name
        }, JWT_SECRET)

        return res.status(200).json({name:name ,token: token})
    }

}