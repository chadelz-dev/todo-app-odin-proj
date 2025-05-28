// import dependencies for data formatting and data management
import { format, differenceInDays } from 'date-fns';
import createTodo from './todo.js';
import createProject from './project.js';
import Storage from './storage.js';

// IIFE to manage DOM manipulation and UI rendering
const Dom = (() => {
  // initialize variables for state: load projects, set default view and theme
  let projects = Storage.load();
  let currentView = 'all';
  let isDarkMode = false;
  const app = document.getElementById('app');

  // log if app element is found or not (for debugging issues)
  if (!app) {
    console.error('Error: #app element not found in DOM');
  } else {
    console.log('Found #app element, starting render');
  }

  // main render function - builds the whole UI
  const render = () => {
    console.log('Rendering app');
    app.innerHTML = ''; // clears existing content
    try {
      // append main UI components to app
      app.append(
        createHeader(),
        createSubHeader(),
        createMain(),
        createFooter()
      );
      console.log('Appended header, sub-header, main, footer');
      updateMain();
      console.log('Updated main content');
    } catch (error) {
      // handle rendering errors (trace for debugging issues)
      console.error('Error during render:', error);
      app.innerHTML = '<p>Error loading app. Please check console.</p>';
    }
  };

  // create header with theme toggle and buttons for adding projects and todos
  const createHeader = () => {
    console.log('Creating header'); // debug tracking
    // create header element
    const header = document.createElement('header');
    // add class for styling
    header.className = 'header';
    // add HTML for header
    header.innerHTML = `
      <button class="button" id="theme-toggle">${
        isDarkMode ? '☼' : '☾'
      }</button>
      <button class="button" id="add-project">Add New Project</button>
      <button class="button" id="add-todo">Add Todo</button>
    `;
    // attach event listeners for header buttons
    header
      .querySelector('#theme-toggle')
      .addEventListener('click', toggleTheme);
    header
      .querySelector('#add-project')
      .addEventListener('click', showProjectPopup);
    header.querySelector('#add-todo').addEventListener('click', showTodoPopup);
    return header;
  };

  // create sub-header with project selection and project list
  const createSubHeader = () => {
    console.log('Creating sub-header'); // debug tracking
    // create sub-header element
    const subHeader = document.createElement('nav');
    // add class for styling
    subHeader.className = 'sub-header';
    // add HTML for sub-header
    subHeader.innerHTML = `
      <select id="project-select">
        <option value="all">All Tasks</option>
        ${projects
          .map((p) => `<option value="${p.id}">${p.name}</option>`)
          .join('')}
      </select>
      <div class="project-list">
        <span data-id="all">All Tasks</span>
        ${projects
          .map((p) => `<span data-id="${p.id}">${p.name}</span>`)
          .join('')}
      </div>
    `;
    // update view when project is selected from dropdown
    subHeader
      .querySelector('#project-select')
      .addEventListener('change', (e) => {
        currentView = e.target.value;
        updateMain();
      });
    // update view when project is clicked from project list
    subHeader.querySelectorAll('.project-list span').forEach((span) => {
      span.addEventListener('click', () => {
        currentView = span.dataset.id;
        updateMain();
      });
    });
    return subHeader;
  };

  // create empty main element to hold todos
  const createMain = () => {
    console.log('Creating main');
    const main = document.createElement('main');
    main.className = 'main';
    return main;
  };

  // create footer with copyright and clear storage button
  const createFooter = () => {
    console.log('Creating footer'); // debug tracking
    // create footer element
    const footer = document.createElement('footer');
    // add class for styling
    footer.className = 'footer';
    // add HTML for footer
    footer.innerHTML = `
      <span>© ${new Date().getFullYear()} Chadelz, all rights reserved</span>
      <button class="button" id="clear-storage">Clear Storage</button>
    `;
    // attach event listener for clear storage button
    footer.querySelector('#clear-storage').addEventListener('click', () => {
      Storage.clear();
      projects = [createProject('General')];
      currentView = 'all';
      Storage.save(projects);
      render();
    });
    return footer;
  };

  // update main content based on current view
  const updateMain = () => {
    console.log('Updating main'); // debug tracking
    // get main element created by createMain()
    const main = document.querySelector('.main');
    // if main element not found, log error and return
    if (!main) {
      console.error('Main element not found');
      return;
    }
    // set heading based on current view
    main.innerHTML = `<h2>${
      currentView === 'all'
        ? 'All Todos'
        : projects.find((p) => p.id === currentView)?.name || 'All Todos'
    }</h2>`;
    // get todos for current view (all or specific project)
    const todos =
      currentView === 'all'
        ? projects.flatMap((p) => p.getTodos())
        : projects.find((p) => p.id === currentView)?.getTodos() || [];

    // create todo bubble element for each todo
    todos.forEach((todo) => {
      // creates a todo bubble element
      const bubble = document.createElement('div');
      // add class for styling
      bubble.className = `todo-bubble ${
        todo.completed ? 'completed' : ''
      } priority-${todo.priority}`;
      // add HTML for todo bubble
      bubble.innerHTML = `
        <span class="todo-title">${todo.completed ? '✅ ' : ''}${
        todo.title
      }</span>
        <span class="todo-date">${format(
          new Date(todo.dueDate),
          'MM/dd/yyyy'
        )} (in ${differenceInDays(
        new Date(todo.dueDate),
        new Date()
      )} days)</span>
        <button class="button details-btn">Details</button>
      `;
      // attach event listener for details button
      bubble
        .querySelector('.details-btn')
        .addEventListener('click', () => toggleDetails(bubble, todo));
      // append the todo bubble to the main element
      main.appendChild(bubble);
    });
    console.log('Main updated with todos:', todos.length);
  };

  // toggle todo bubble between collapsed and expanded views
  const toggleDetails = (bubble, todo) => {
    console.log('Toggling details for todo:', todo.title);
    if (bubble.classList.contains('expanded')) {
      // collapse and show basic info
      bubble.classList.remove('expanded');
      bubble.innerHTML = `
        <span class="todo-title">${todo.completed ? '✅ ' : ''}${
        todo.title
      }</span>
        <span class="todo-date">${format(
          new Date(todo.dueDate),
          'MM/dd/yyyy'
        )} (in ${differenceInDays(
        new Date(todo.dueDate),
        new Date()
      )} days)</span>
        <button class="button details-btn">Details</button>
      `;
      // attach event listener for details button
      bubble
        .querySelector('.details-btn')
        .addEventListener('click', () => toggleDetails(bubble, todo));
    } else {
      // expand and show full details with action buttons
      bubble.classList.add('expanded');
      // update bubble content html
      bubble.innerHTML = `
        <span class="todo-title">${todo.completed ? '✅ ' : ''}${
        todo.title
      }</span>
        <p><strong>Description:</strong> ${todo.description}</p>
        <p><strong>Notes:</strong> ${todo.notes}</p>
        <p><strong>Priority:</strong> ${todo.priority}</p>
        <div class="checklist">
          <strong>Checklist:</strong>
          <ul>${todo.checklist.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
        <button class="button edit-btn">Edit</button>
        <button class="button delete-btn">Delete</button>
        <button class="button collapse-btn">Collapse</button>
        <button class="button complete-btn">${
          todo.completed ? 'Mark Incomplete' : 'Mark Complete'
        }</button>
      `;
      // adding event listeners to action buttons
      bubble
        .querySelector('.edit-btn')
        .addEventListener('click', () => editTodo(bubble, todo));
      bubble
        .querySelector('.delete-btn')
        .addEventListener('click', () => deleteTodo(todo));
      bubble
        .querySelector('.collapse-btn')
        .addEventListener('click', () => toggleDetails(bubble, todo));
      bubble.querySelector('.complete-btn').addEventListener('click', () => {
        todo.toggleComplete();
        Storage.save(projects);
        updateMain();
      });
    }
  };

  // edit a todo properties via a form in the bubble
  const editTodo = (bubble, todo) => {
    console.log('Editing todo:', todo.title); // debug tracking
    // display edit form with current todo values
    bubble.innerHTML = `
      <input type="text" value="${todo.title}" class="edit-title">
      <p><strong>Description:</strong> <textarea class="edit-description">${
        todo.description
      }</textarea></p>
      <p><strong>Notes:</strong> <textarea class="edit-notes">${
        todo.notes
      }</textarea></p>
      <p><strong>Priority:</strong>
        <select class="edit-priority">
          <option value="low" ${
            todo.priority === 'low' ? 'selected' : ''
          }>Low</option>
          <option value="medium" ${
            todo.priority === 'medium' ? 'selected' : ''
          }>Medium</option>
          <option value="high" ${
            todo.priority === 'high' ? 'selected' : ''
          }>High</option>
        </select>
      </p>
      <p><strong>Due Date:</strong> <input type="date" value="${
        todo.dueDate
      }" class="edit-due-date"></p>
      <p><strong>Checklist:</strong> <textarea class="edit-checklist">${todo.checklist.join(
        '\n'
      )}</textarea></p>
      <p class="error" style="display: none;">Please fill all required sections</p>
      <button class="button save-btn">Save</button>
      <button class="button cancel-btn">Cancel</button>
    `;
    // save updated todo data when save button is clicked
    bubble.querySelector('.save-btn').addEventListener('click', () => {
      const newData = {
        title: bubble.querySelector('.edit-title').value,
        description: bubble.querySelector('.edit-description').value,
        notes: bubble.querySelector('.edit-notes').value,
        priority: bubble.querySelector('.edit-priority').value,
        dueDate: bubble.querySelector('.edit-due-date').value,
        checklist: bubble
          .querySelector('.edit-checklist')
          .value.split('\n')
          .filter((item) => item.trim()),
      };
      // validate inputs before saving
      if (
        Object.entries(newData).some(
          ([key, val]) =>
            key !== 'checklist' &&
            (!val || (Array.isArray(val) && val.length === 0))
        )
      ) {
        bubble.querySelector('.error').style.display = 'block';
        return;
      }
      // else update todo with new data
      todo.update(newData);
      // save updated projects to localStorage
      Storage.save(projects);
      // update main view
      updateMain();
    });
    // cancel editig and revert to details view
    bubble
      .querySelector('.cancel-btn')
      .addEventListener('click', () => toggleDetails(bubble, todo));
  };

  // delete a todo from its project
  const deleteTodo = (todo) => {
    console.log('Deleting todo:', todo.title); // debug tracking
    // find the project the todo belongs to
    const project = projects.find((p) => p.id === todo.projectId);
    // if project exists, remove the todo
    if (project) {
      project.removeTodo(todo.title); // actually removes the todo
      Storage.save(projects); // save updated projects to localStorage
      updateMain(); // updates the main view
      // else log error
    } else {
      console.error('Project not found for todo:', todo.title);
    }
  };

  // show popup for creating a new project (Single responsibility principles)
  const showProjectPopup = () => {
    console.log('Showing project popup');
    // create popup element
    const popup = document.createElement('div');
    // add class for styling
    popup.className = 'popup';
    // add HTML for popup
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Create New Project</h3>
        <input type="text" id="project-title" placeholder="Project Title">
        <p class="error" style="display: none;">Please fill this section</p>
        <button class="button" id="create-project">Create Project</button>
        <button id="close-popup">X</button>
      </div>
    `;
    // add popup to app
    app.appendChild(popup);
    // attach event listener for create project button
    popup.querySelector('#create-project').addEventListener('click', () => {
      const title = popup.querySelector('#project-title').value;
      // if title does not exist or is empty, show error
      if (!title) {
        popup.querySelector('.error').style.display = 'block';
        return;
      }
      // else create new project and add it to the list
      projects.push(createProject(title));
      Storage.save(projects); // save updated projects to localStorage
      // update main view
      render();
    });
    // attach event listener for close button
    popup.querySelector('#close-popup').addEventListener('click', () => {
      // remove popup from app after closing
      app.removeChild(popup);
    });
  };

  // show popup for creating a new todo (Single responsibility principles)
  const showTodoPopup = () => {
    console.log('Showing todo popup');
    // create popup element
    const popup = document.createElement('div');
    // add class for styling
    popup.className = 'popup';
    // populate popup with HTML
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Create Todo</h3>
        <input type="text" id="todo-title" placeholder="Todo Title">
        <textarea id="todo-description" placeholder="Description"></textarea>
        <input type="date" id="todo-due-date">
        <select id="todo-priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select id="todo-project">
          ${projects
            .map((p) => `<option value="${p.id}">${p.name}</option>`)
            .join('')}
        </select>
        <textarea id="todo-notes" placeholder="Notes"></textarea>
        <textarea id="todo-checklist" placeholder="Checklist (one per line, optional)"></textarea>
        <p class="error" style="display: none;">Please fill all required fields</p>
        <button class="button" id="create-todo">Create</button>
        <button id="close-popup">X</button>
      </div>
    `;
    // add popup to app
    app.appendChild(popup);
    // attach event listener for create todo button
    popup.querySelector('#create-todo').addEventListener('click', () => {
      const todoData = {
        title: popup.querySelector('#todo-title').value,
        description: popup.querySelector('#todo-description').value,
        dueDate: popup.querySelector('#todo-due-date').value,
        priority: popup.querySelector('#todo-priority').value,
        notes: popup.querySelector('#todo-notes').value,
        projectId: popup.querySelector('#todo-project').value,
        checklist: popup
          .querySelector('#todo-checklist')
          .value.split('\n')
          .filter((item) => item.trim()),
      };
      console.log('Validating todo:', todoData); // Debug tracking
      // validate inputs before saving
      if (
        Object.entries(todoData).some(
          ([key, val]) =>
            // check if key is not checklist and value is not empty
            key !== 'checklist' &&
            (!val || (Array.isArray(val) && val.length === 0))
        )
      ) {
        console.log('Validation failed:', todoData); // Debug tracking
        // if validation fails, show error
        popup.querySelector('.error').style.display = 'block';
        return;
      }
      // find the project the todo belongs to
      const project = projects.find((p) => p.id === todoData.projectId);
      // if project exists, add the todo
      if (project) {
        project.addTodo(
          createTodo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.projectId,
            todoData.checklist
          )
        );
        Storage.save(projects); // save updated projects to localStorage
        // remove popup from app after closing
        app.removeChild(popup);
        // update main view
        render();
        // else log error
      } else {
        console.error('Project not found for ID:', todoData.projectId);
      }
    });
    // attach event listener for close button
    popup.querySelector('#close-popup').addEventListener('click', () => {
      // remove popup from app after clicking close button
      app.removeChild(popup);
    });
  };

  // toggle theme between light and dark mode (SRP)
  const toggleTheme = () => {
    console.log('Toggling theme, isDarkMode:', isDarkMode);
    // toggle isDarkMode state
    isDarkMode = !isDarkMode;
    // add dark-mode class to body element
    document.body.classList.toggle('dark-mode');
    // update main view
    render();
  };

  // return the render function for use in other modules
  return { render };
})();

// export the Dom module for use in other modules
export default Dom;
