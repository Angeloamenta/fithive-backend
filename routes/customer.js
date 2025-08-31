import express from 'express'

import { 
    addCustomer,
    getCustomers,
    deleteCustomer, 
    getCustomerById, 
    addWorkout, 
    addDay, 
    addExercise,
    deleteDay,
    deletePlan,
    deleteExercise,
    editCustomer,
    editPlan,
    editDay,
    editExercise

 } from '../controllers/customer.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getCustomers)
router.get('/:id', getCustomerById)
// post
router.post('/add', authenticateToken,addCustomer)
router.post('/:id/workout',authenticateToken, addWorkout)
router.post('/:userId/workout/:planId/day',authenticateToken, addDay)
router.post('/:userId/workout/:planId/day/:dayId/exercise', addExercise)
// delete
router.delete('/:id',authenticateToken, deleteCustomer)
router.delete('/:userId/workout/:planId/',authenticateToken, deletePlan);
router.delete('/:userId/workout/:planId/day/:dayId',authenticateToken, deleteDay);
router.delete('/:userId/workout/:planId/day/:dayId/exercise/:exerciseId',authenticateToken, deleteExercise);
// edit
router.patch('/:customerId',authenticateToken,  editCustomer)
router.patch('/:customerId/workout/:planId',authenticateToken, editPlan)
router.patch('/:customerId/workout/:planId/day/:dayId',authenticateToken, editDay)
router.patch('/:customerId/workout/:planId/day/:dayId/exercise/:exerciseId', authenticateToken, editExercise)











export default router;