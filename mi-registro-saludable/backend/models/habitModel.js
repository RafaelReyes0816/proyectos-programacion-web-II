let habits = [];

export const HabitModel = {
  getAll: () => habits,

  create: (nombre) => {
    const newHabit = { id: Date.now(), nombre, cumplido: false };
    habits.push(newHabit);
    return newHabit;
  },

  toggle: (id) => {
    habits = habits.map(habit =>
      habit.id === Number(id)
        ? { ...habit, cumplido: !habit.cumplido }
        : habit
    );
  },

  delete: (id) => {
    habits = habits.filter(habit => habit.id !== Number(id));
  }
};
