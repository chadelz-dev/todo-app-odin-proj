// factory func to create a todo object
const createTodo = (
  title,
  description,
  dueDate,
  priority,
  notes,
  projectId,
  checklist = [], // optional checklist array
  completed = false // default complete status
) => {
  return {
    // todo properties
    title,
    description,
    dueDate,
    priority,
    notes,
    projectId,
    checklist,
    completed,
    // toggles the completion status of the todos
    toggleComplete() {
      this.completed = !this.completed;
    },
    // updates todo props with new values (keeps existing if not provided)
    update({ title, description, dueDate, priority, notes, checklist }) {
      this.title = title || this.title;
      this.description = description || this.description;
      this.dueDate = dueDate || this.dueDate;
      this.priority = priority || this.priority;
      this.notes = notes || this.notes;
      this.checklist = checklist || this.checklist;
    },
  };
};

// export the factory function for use in other modules
export default createTodo;
