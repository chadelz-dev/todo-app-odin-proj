- Deployed to GitHub Pages from the `deploy-branch`, serving from the `/dist` folder.

## Setup

1. Clone the repo: `git clone https://github.com/<your-username>/todo-app-odin-proj.git`

2. Install dependencies: `npm install`

3. Run locally: `npm run start`

4. Build for production: `npm run build`

## Debug

if there is an issue with rendering after running and rerunning,

clear the local storage:

Open DevTools:

in your browser

Open DevTools (F12) > Application tab > Local Storage > http://localhost:8080.

Find the key todoApp and delete it.

then rerun the app
