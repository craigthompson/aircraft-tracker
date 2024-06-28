# Aircraft Tracker

## Running Locally

1. Clone repo
2. Change working directory into the cloned project directory
3. Install node packages `npm install`

4. Install PostgreSQL, if not already installed on machine

   - [Download PostreSQL](https://www.postgresql.org/download/)

5. Make a .env file using the .env.example file as a template `cp .env.example .env`

   - populate the .env with the correct values including your PostgreSQL username and password.

6. Create database by running: `npm run db:create`

   - If you want to seed the database run: `npm run db:seed`

7. Run the app `npm run dev`

## Database Commands

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run db:create` | Create database                            |
| `npm run db:seed`   | Seed the database                          |
| `npm run db:sync`   | Sync the DB                                |
| `npm run db:drop`   | Drop the DB (includes confirmation prompt) |
