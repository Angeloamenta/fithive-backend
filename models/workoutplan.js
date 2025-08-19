import mongoose from 'mongoose'

const ExerciseSchema = new mongoose.Schema({
    name: {type:String, required:true},
    repset:{type:String, required:true},
    rec:{type: string},
    notes:{type:String, required:true}
})

const DaySchema = new mongoose.Schema({
    name:{type:String, required:true},
    exercises:{type: [ExerciseSchema], default: []}
})


const WorkoutPlanSchema = new mongoose.Schema({
    name:{type:String, required:true},
    days:[DaySchema],
    createdAt:{type:Date, default: Date.now}
})

export { WorkoutPlanSchema }

// export const Workout = mongoose.model('Workout', WorkoutPlanSchema)


