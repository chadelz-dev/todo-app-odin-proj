// factory func to create a project object
const createProject = (name, id = Date.now().toString()) => {
  let todos = []; // initialize an empty array for todo projects

  return {
    id, // unique proj identifier
    name, // proj name

    // get the list of todos
    getTodos() {
      return todos;
    },

    // and a todo to the proj
    addTodo(todo) {
      todos.push(todo);
    },

    // remove a todo by its title
    removeTodo(todoTitle) {
      todos = todos.filter((todo) => todo.title !== todoTitle);
    },
  };
};

// export the factory function for use in other modules
export default createProject;
