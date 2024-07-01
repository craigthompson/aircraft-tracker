# Aircraft Tracker (Skydar) 🛩️

![Screenshot of the aircraft tracker app](./public/assets/app-screenshot.jpg)

## Table Of Contents

- [Running Locally](#running-locally)
- [Database Commands](#database-commands)
- [Technologies Utilized](#technologies-utilized)
- [Features](#features)

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
     - Note: Seed data has old enough lastContact timestamps that the database cleanup cron job will remove the seed data when it runs.

7. Run the app `npm run dev`

## Database Commands

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run db:create` | Create database                            |
| `npm run db:seed`   | Seed the database                          |
| `npm run db:sync`   | Sync the DB                                |
| `npm run db:drop`   | Drop the DB (includes confirmation prompt) |

## Technologies Utilized

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express JS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=Puppeteer&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=Raspberry%20Pi&logoColor=white)

- React
- Vite + Express
- PostgreSQL with Sequelize
- ADS-B Receiver
  - Feeding data to external data sources
    - OpenSky API
    - Flightradar24
    - FlightAware
  - Raspberry Pi for the computer
  - SDR digital radio receiver
  - Bandpass filter for ADS-B specific frequencies
- Leaflet and React-Leaflet for the map
- Node-Cron — for scheduled tasks
  - External API calls
  - Web scraper
  - Database cleanup
- React-Dom — to create custom aircraft markers for map
- Axios — for both internal and external API calls
- [Socket.io](http://Socket.io)
  - Immediate data updates from server to multiple clients
- Puppeteer web scraper
  - To get flight details from free public sources without using expensive commercial APIs.
- Tailwind CSS
  - including customized classes and theme colors
- Chalk — for colorizing my structured log outputs.
  - Enables easier and quicker visual parsing of logs.

## Features

- Predictive position and altitude for aircraft on map
  - Implemented trigonometry to calculate next position coordinates on map using the most recent data coordinates, velocity, and true tracking direction along with the data's capture timestamp.
  - Reduces frequency of data updates from server, since client can predict aircraft positions since last data update.
  - Creates appealing smooth movement of aircraft on map.
  - Predictively calculates altitude based on most recent data's altitude, vertical speed, and data's capture timestamp.
- Altitude indicating colors
  - See which planes are airborne vs on the ground.
- Vertical rate indicating arrows, including indication of magnitude.
- Flight watch list
  - Airline logo
  - Flight status
  - Departure and arrival airports
- Weather radar overlay
- Multiple selectable map image layers
- Aeronautical chart elements
  - Airspaces
  - Airports and heliports
- Aircraft popup details
  - Aircraft images
  - ADS-B transmitter ICAO24 identifier
  - Callsign / registration
  - Altitude
  - Vertical speed
  - Ground speed
  - True tracking direction
- Callsign next to aircraft marker
- Ordering aircraft icons on top of others based on altitude

---

:star: Star me on GitHub — it does motivate me
