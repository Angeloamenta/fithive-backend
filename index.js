import express from 'express'
import dotenv from 'dotenv';
import cors  from 'cors'
import mongoose from 'mongoose'

import customerRoutes from './routes/customer.js'
import authRoutes from './routes/auth.js'



dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(cors())


// app.listen(PORT, () => {
//     console.log(`server avviato sulla porta ${PORT}`);
    
// })

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT, ()=> {
            console.log(`server running on port: ${PORT}`);

    })
})

app.use('/customers', customerRoutes)
app.use('/auth', authRoutes )

