// import factory funcs for todos and projects
import createTodo from './todo.js';
import createProject from './project.js';

// IIFE to manage localStorage
const Storage = (() => {
  const STORAGE_KEY = 'todoApp'; // key for local storage

  // save projs and their todos to localStorage
  const save = (projects) => {
    /// serialize projects and todos into a JSON compatible format
    const serializedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      todos: project.getTodos().map((todo) => ({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        notes: todo.notes,
        projectId: todo.projectId,
        checklist: todo.checklist,
        completed: todo.completed,
      })),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedProjects));
    console.log('Saved to localStorage:', serializedProjects);
  };

  // loads projects and todos from localStorage
  const load = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    // if no data in localStorage, return default project with three todos
    if (!data) {
      const defaultProject = createProject('General');
      // add default todos to General project
      defaultProject.addTodo(
        createTodo(
          'Create project', // title
          'Create a new project to organize tasks', // description
          new Date().toISOString().split('T')[0], // today's date
          'low', // priority
          'Use the Add New Project button', // notes
          defaultProject.id, // project ID
          ['Open project popup', 'Enter project name', 'Save project'], // checklist
          false // not completed
        )
      );
      defaultProject.addTodo(
        createTodo(
          'Create todo', // title
          'Add a new todo to a project', // description
          new Date().toISOString().split('T')[0], // today's date
          'medium', // priority
          'Use the Add Todo button', // notes
          defaultProject.id, // project ID
          ['Open todo popup', 'Fill in details', 'Save todo'], // checklist
          false // not completed
        )
      );
      defaultProject.addTodo(
        createTodo(
          'Play with UI todos, edit, mark as done, delete todo', // title
          'Experiment with todo features in the UI', // description
          new Date().toISOString().split('T')[0], // today's date
          'high', // priority
          'Try editing, completing, and deleting todos', // notes
          defaultProject.id, // project ID
          ['Edit a todo', 'Mark a todo as done', 'Delete a todo'], // checklist
          false // not completed
        )
      );
      console.log(
        'No data in localStorage, returning default project with todos'
      );
      save([defaultProject]); // save default project with todos to localStorage
      return [defaultProject];
    }

    try {
      const projects = JSON.parse(data);
      // validate data is an array, else return default proj with three todos
      if (!Array.isArray(projects)) {
        console.warn(
          'Invalid projects data in localStorage, resetting to default'
        );
        const defaultProject = createProject('General');
        // add default todos to General project
        defaultProject.addTodo(
          createTodo(
            'Create project', // title
            'Create a new project to organize tasks', // description
            new Date().toISOString().split('T')[0], // today's date
            'low', // priority
            'Use the Add New Project button', // notes
            defaultProject.id, // project ID
            ['Open project popup', 'Enter project name', 'Save project'], // checklist
            false // not completed
          )
        );
        defaultProject.addTodo(
          createTodo(
            'Create todo', // title
            'Add a new todo to a project', // description
            new Date().toISOString().split('T')[0], // today's date
            'medium', // priority
            'Use the Add Todo button', // notes
            defaultProject.id, // project ID
            ['Open todo popup', 'Fill in details', 'Save todo'], // checklist
            false // not completed
          )
        );
        defaultProject.addTodo(
          createTodo(
            'Play with UI todos, edit, mark as done, delete todo', // title
            'Experiment with todo features in the UI', // description
            new Date().toISOString().split('T')[0], // today's date
            'high', // priority
            'Try editing, completing, and deleting todos', // notes
            defaultProject.id, // project ID
            ['Edit a todo', 'Mark a todo as done', 'Delete a todo'], // checklist
            false // not completed
          )
        );
        save([defaultProject]); // save default project with todos to localStorage
        return [defaultProject];
      }

      // reconstruct properties and their todos
      const reconstructedProjects = projects.map((project) => {
        // reconstruct project
        const newProject = createProject(project.name, project.id);
        // reconstruct todos
        const todos = Array.isArray(project.todos) ? project.todos : [];
        todos.forEach((todo) => {
          newProject.addTodo(
            createTodo(
              todo.title,
              todo.description,
              todo.dueDate,
              todo.priority,
              todo.notes,
              todo.projectId,
              Array.isArray(todo.checklist) ? todo.checklist : [],
              todo.completed || false
            )
          );
        });
        return newProject;
      });

      // check if General project exists and has no todos, then add default todos
      let generalProject = reconstructedProjects.find(
        (p) => p.name === 'General'
      );
      if (!generalProject) {
        generalProject = createProject('General');
        reconstructedProjects.push(generalProject);
      }
      if (generalProject.getTodos().length === 0) {
        // add default todos to General project if it has no todos
        generalProject.addTodo(
          createTodo(
            'Create project', // title
            'Create a new project to organize tasks', // description
            new Date().toISOString().split('T')[0], // today's date
            'low', // priority
            'Use the Add New Project button', // notes
            generalProject.id, // project ID
            ['Open project popup', 'Enter project name', 'Save project'], // checklist
            false // not completed
          )
        );
        generalProject.addTodo(
          createTodo(
            'Create todo', // title
            'Add a new todo to a project', // description
            new Date().toISOString().split('T')[0], // today's date
            'medium', // priority
            'Use the Add Todo button', // notes
            generalProject.id, // project ID
            ['Open todo popup', 'Fill in details', 'Save todo'], // checklist
            false // not completed
          )
        );
        generalProject.addTodo(
          createTodo(
            'Play with UI, edit, mark as done, delete todo', // title
            'Experiment with todo features in the UI', // description
            new Date().toISOString().split('T')[0], // today's date
            'high', // priority
            'Try editing, completing, and deleting todos', // notes
            generalProject.id, // project ID
            ['Edit a todo', 'Mark a todo as done', 'Delete a todo'], // checklist
            false // not completed
          )
        );
        console.log('Added default todos to General project');
      }
      save(reconstructedProjects); // save updated projects to localStorage
      return reconstructedProjects;
    } catch (error) {
      // handle parsing errors by returning a default proj with three todos
      console.error('Error parsing localStorage data:', error);
      console.warn('Resetting to default project with todos');
      const defaultProject = createProject('General');
      // add default todos to General project
      defaultProject.addTodo(
        createTodo(
          'Create project', // title
          'Create a new project to organize tasks', // description
          new Date().toISOString().split('T')[0], // today's date
          'low', // priority
          'Use the Add New Project button', // notes
          defaultProject.id, // project ID
          ['Open project popup', 'Enter project name', 'Save project'], // checklist
          false // not completed
        )
      );
      defaultProject.addTodo(
        createTodo(
          'Create todo', // title
          'Add a new todo to a project', // description
          new Date().toISOString().split('T')[0], // today's date
          'medium', // priority
          'Use the Add Todo button', // notes
          defaultProject.id, // project ID
          ['Open todo popup', 'Fill in details', 'Save todo'], // checklist
          false // not completed
        )
      );
      defaultProject.addTodo(
        createTodo(
          'Play with UI todos, edit, mark as done, delete todo', // title
          'Experiment with todo features in the UI', // description
          new Date().toISOString().split('T')[0], // today's date
          'high', // priority
          'Try editing, completing, and deleting todos', // notes
          defaultProject.id, // project ID
          ['Edit a todo', 'Mark a todo as done', 'Delete a todo'], // checklist
          false // not completed
        )
      );
      save([defaultProject]); // save default project with todos to localStorage
      return [defaultProject];
    }
  };

  // clear all data from local storage (using button in UI)
  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared localStorage');
  };

  return { save, load, clear };
})();

// export storage module
export default Storage;
