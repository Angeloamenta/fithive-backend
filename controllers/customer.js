import { Customer } from "../models/customer.js";
import mongoose from "mongoose";

// ---------------------- CREATE ----------------------

export const addWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { name = "Nuovo Piano di Allenamento" } = req.body; // Nome di default se non specificato

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Cliente non trovato" });
    }

    // Crea il workout plan con nome e struttura base
    const newWorkoutPlan = {
      name,
      days: [],
      createdAt: new Date()
    };

    customer.workoutPlans.push(newWorkoutPlan);
    await customer.save();

    // Prendi l'ultimo workout aggiunto (quello appena creato)
    const createdWorkout = customer.workoutPlans[customer.workoutPlans.length - 1];

    res.status(201).json(createdWorkout); // Ritorna l'oggetto completo con _id
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addDay = async (req, res) => {
  try {
    const { userId, planId } = req.params;
    const { name } = req.body;

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Scheda non trovata" });
    }

    // Crea il nuovo giorno
    const newDay = { name, exercises: [] };
    workoutPlan.days.push(newDay);
    await customer.save();

    // Prendi l'ultimo giorno aggiunto (quello appena creato)
    const createdDay = workoutPlan.days[workoutPlan.days.length - 1];

    res.status(200).json(createdDay); // Ritorna il day con _id
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addExercise = async (req, res) => {
  try {
    const { userId, planId, dayId } = req.params;
    const exerciseData = req.body;

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Scheda non trovata" });
    }

    const workoutDay = workoutPlan.days.id(dayId);
    if (!workoutDay) {
      return res.status(404).json({ message: "Giorno non trovato" });
    }

    // Aggiungi l'esercizio
    workoutDay.exercises.push(exerciseData);
    await customer.save();

    // Prendi l'ultimo esercizio aggiunto (quello appena creato)
    const createdExercise = workoutDay.exercises[workoutDay.exercises.length - 1];

    res.status(201).json(createdExercise); // Ritorna l'esercizio con _id
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- READ ----------------------

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "ID non valido" });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente non trovato" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- DELETE ----------------------

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "ID non valido" });
    }

    await Customer.findByIdAndDelete(id);
    res.status(200).json({ message: "Utente eliminato" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { userId, planId } = req.params;
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    customer.workoutPlans.pull({ _id: planId });
    await customer.save();

    res.status(200).json({ message: "Scheda eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDay = async (req, res) => {
  try {
    const { userId, planId, dayId } = req.params;

    const updated = await Customer.updateOne(
      { _id: userId, "workoutPlans._id": planId },
      { $pull: { "workoutPlans.$.days": { _id: dayId } } }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ message: "Giorno non trovato" });
    }

    res.status(200).json({ message: "Giorno eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const { userId, planId, dayId, exerciseId } = req.params;
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Scheda non trovata" });
    }

    const day = workoutPlan.days.id(dayId);
    if (!day) {
      return res.status(404).json({ message: "Giorno non trovato" });
    }

    const exercise = day.exercises.id(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }

    exercise.remove();
    await customer.save();

    res.status(200).json({ message: "Esercizio eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- UPDATE ----------------------

export const editCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { firstName, lastName } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;

    await customer.save();
    res.status(200).json({ message: "Utente modificato" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editPlan = async (req, res) => {
  try {
    const { customerId, planId } = req.params;
    const { name } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Scheda non trovata" });
    }

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
    const { name } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Scheda non trovata" });
    }

    const day = workoutPlan.days.id(dayId);
    if (!day) {
      return res.status(404).json({ message: "Giorno non trovato" });
    }

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
    const { name, repset, rec, notes } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const workoutPlan = customer.workoutPlans.id(planId);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Scheda non trovata" });
    }

    const day = workoutPlan.days.id(dayId);
    if (!day) {
      return res.status(404).json({ message: "Giorno non trovato" });
    }

    const exercise = day.exercises.id(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: "Esercizio non trovato" });
    }

    if (name) exercise.name = name;
    if (repset) exercise.repset = repset;
    if (rec) exercise.rec = rec;
    if (notes) exercise.notes = notes;

    await customer.save();
    res.status(200).json({ message: "Esercizio modificato" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
