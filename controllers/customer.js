import { Customer } from "../models/customer.js";
import mongoose from "mongoose";

export const addCustomer = async (req, res) => {
  const customer = req.body;
  const newCustomer = new Customer(customer);

  try {
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.statur(404).json({ message: "id non trovato" });
  }

  try {
    const user = await Customer.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.statur(404).json({ message: error.message });
  }
};

//schede

export const addWorkout = async (req, res) => {
  const { id } = req.params;
  const workoutPlan = req.body;

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Cliente non trovato" });
    }

    customer.workoutPlans.push(workoutPlan);
    await customer.save();

    res
      .status(201)
      .json({ message: "Scheda aggiunta con successo", workoutPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// day

export const addDay = async (req, res) => {
  try {
    const { userId, planId } = req.params;
    const { name } = req.body;

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);
    if (!workoutPlan) {
      return res.status(404).json({ message: "la scheda non è stata trovata" });
    }

    workoutPlan.days.push({ name });

    await customer.save();

    res.status(200).json({ message: "giorno aggiunto con successo" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// exercises

export const addExercise = async (req, res) => {
  try {
    const { userId, planId, dayId } = req.params;

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "l'utente non è stato trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);

    if (!workoutPlan) {
      return res.status(404).json({ message: "scheda non trovata" });
    }

    const workoutDay = workoutPlan.days.id(dayId);

    if (!workoutDay) {
      return res.status(404).json({ message: "giorno non trovato" });
    }

    workoutDay.exercises.push(req.body);

    await customer.save();
    res
      .status(201)
      .json({ message: "Esercizio aggiunto con successo", exercise: req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.statur(404).json({ message: "id non trovato" });
  }

  try {
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ message: "utente eliminato" });
  } catch (error) {
    res.statur(404).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { userId, planId } = req.params;
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);

    if (!workoutPlan) {
      return res.status(404).json({ message: "scheda non trovata" });
    }

    workoutPlan.remove();

    await customer.save();

    res.status(200).json({ message: "allenamento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDay = async (req, res) => {
  try {
    const { userId, planId, dayId } = req.params;
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);

    if (!workoutPlan) {
      return res.status(404).json({ message: "scheda non trovata" });
    }

    const day = workoutPlan.days.id(dayId);

    if (!day) {
      return res.status(404).json({ message: "giorno non trovato" });
    }

    day.remove();

    await customer.save();

    res.status(200).json({ message: "giorno eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const { userId, planId, dayId, exerciseId } = req.params;
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);

    if (!workoutPlan) {
      return res.status(404).json({ message: "scheda non trovata" });
    }

    const day = workoutPlan.days.id(dayId);

    if (!day) {
      return res.status(404).json({ message: "giorno non trovato" });
    }

    const exercise = day.exercises.id(exerciseId);

    if (!exercise) {
      return res.status(404).json({ message: "esercizio non trovato" });
    }

    exercise.remove();

    await customer.save();

    res.status(200).json({ message: "esercizio eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// edit

export const editCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const { firstName, lastName } = req.body;

    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;

    await customer.save();

    res.status(200).json({ message: "utente modificato" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editPlan = async (req, res) => {
  try {
    const { customerId, planId } = req.params;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);

    if (!workoutPlan) {
      return res.status(404).json({ message: "scheda non trovata" });
    }

    const { name } = req.body;

    if (name) workoutPlan.name = name;

    await customer.save();

    res.status(200).json({ message: `Scheda rinominata in "${name}"` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editDay = async (req, res) => {
  try {
    const { customerId, planId, dayId } = req.params;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);

    if (!workoutPlan) {
      return res.status(404).json({ message: "scheda non trovata" });
    }

    const day = workoutPlan.days.id(dayId);

    if (!day) {
      return res.status(404).json({ message: "giorno non trovato" });
    }

    const { name } = req.body;

    if (name) day.name = name;

    await customer.save();

    res.status(200).json({ message: `Giorno rinominato in "${name}"` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editExercise = async (req, res) => {
  try {
    const { customerId, planId, dayId, exerciseId } = req.params;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);

    if (!workoutPlan) {
      return res.status(404).json({ message: "scheda non trovata" });
    }

    const day = workoutPlan.days.id(dayId);

    if (!day) {
      return res.status(404).json({ message: "giorno non trovato" });
    }

    const exercise = day.exercises.id(exerciseId);

    if (!exercise) {
      return res.status(404).json({ message: "esercizio non trovato" });
    }

    const { name, repset, notes } = req.body;

    if (name) exercise.name = name;
    if (repset) exercise.repset = repset;
    if (rec) exercise.rec = rec;
    if (notes) exercise.notes = notes;

    await customer.save();

    res.status(200).json({ message: `Esercizio modificato` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
