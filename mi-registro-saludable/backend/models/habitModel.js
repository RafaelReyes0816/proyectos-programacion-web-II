let habits = [];

export const HabitModel = {
  getAll: () => habits,

  findById: (id) => {
    return habits.find(habit => habit.id === Number(id));
  },

  create: (nombre) => {
    const newHabit = { id: Date.now(), nombre, cumplido: false };
    habits.push(newHabit);
    return newHabit;
  },

  toggle: (id) => {
    const habit = habits.find(habit => habit.id === Number(id));
    if (!habit) return null;
    
    habits = habits.map(habit =>
      habit.id === Number(id)
        ? { ...habit, cumplido: !habit.cumplido }
        : habit
    );
    
    return habits.find(habit => habit.id === Number(id));
  },

  delete: (id) => {
    const habit = habits.find(habit => habit.id === Number(id));
    if (!habit) return false;
    
    habits = habits.filter(habit => habit.id !== Number(id));
    return true;
  }
};
