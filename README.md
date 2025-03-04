[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PfvsFSwl)
# NodeJS - Intro Exercise

**Goal:** Create your first NodeJS server using TypeScript.

## Instructions

1. Create a `dev` branch after accepting the assignment.
2. Clone your repository and switch to the `dev` branch.
3. Run `npm init -y` to generate your `package.json` file which you need if you will use external third-party packages.
4. Create two directories called `dist` and `src`.
5. Create your server file inside the `src` directory. You can call it `server.ts` or `index.ts`.
6. Create a server with four routes and their corresponding response:

   - Home `/ 'text/html' 200`: Should return `<h1>Home</h1>`
   - About `/about 'text/html' 200`: Should return `<h1>About</h1>`
   - My Account `/my-account 'text/plain' 403`: Should return `You have no access to this page`
   - Any other url `'text/plain' 404`: Should return `Page not found`

7. Install the nodemon package globally if you haven't done yet by running `npm install -g nodemon`
8. To run your server, compile your TypeScript files first by running `npx tsc --watch` in one terminal. Then, execute the compiled JS file by running `node dist/server.js` or `nodemon dist/server.js` if you want to listen for any changes.
9. Once you are done, commit and push your changes. Create a PR from `dev` to `main` and merge.
