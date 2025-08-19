import mongoose from 'mongoose';
import { WorkoutPlanSchema } from './workoutplan.js';

const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  workoutPlans: { type: [WorkoutPlanSchema], default: [] }

});

export const Customer = mongoose.model('Customer', CustomerSchema);





// import mongoose from 'mongoose'

// const customerSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: false
//     },

//     cognome: {
//         type: String,
//         required: true,
//         unique: false
//     }

// }, {timestamps: true})

// export const Customer = mongoose.model('Customer', customerSchema)