# Express Backends
Command Line Tool to create an Express Backend Project using an existing template

## How to create a new backend project
1. Run the Following Command

    `npx express-backends@latest`
2. If it asks to install package, do so.
3. Enter your project's name
4. Enter your project description
5. Enter your name
6. Select if you want it to be public or private (package.json)
7. Choose the Template you want
8. Wait for it to install dependencies
9. cd into the project folder
10. Configure the .env file
11. (If Using Drizzle Only) Use `npm run generate` to generate a migration file.
12. use `npm run dev` to start a dev environment

## Current Templates
### Typescript without DB
- Typescript
- ExpressJS
- CORS
- HTTPs support

### Typescript with Postgres
- Typescript
- ExpressJS
- CORS
- HTTPs support
- pg

### Typescript with Drizzle (Postgres)
- Typescript
- ExpressJS
- CORS
- HTTPs support
- pg
- drizzle-orm

### Typescript with MySQL
- Typescript
- ExpressJS
- CORS
- HTTPs support
- mysql2