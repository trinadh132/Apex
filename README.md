# Apexplus

## Introduction
This project aims to create a mini Pokémon game where users can manage their Pokémon collection. The main features include:

- **Add Pokémon**: Users can add new Pokémon to their list.
- **Interact with Pokémon**: Users have options to:
  - Pokémon Go
  - Pokémon Flee
  - Pokémon Cease
- **Edit/Delete Pokémon**: Users can edit or delete the Pokémon from their list.

Enjoy playing and managing your Pokémon with this simple and fun game!

## Installation

To install and run the project, follow these steps:

### Clone the repository

1. Clone the repository:

   ```sh
   git clone https://github.com/trinadh132/Apex.git

### For running project

### Frontend
1. Navigate to the backend directory: `cd apexplus`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Backend 
1. Navigate to the backend directory: `cd apexplus_api`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## Deployment
**frontend**:[Pokemon Game](https://staging.d1szl92k2opc9s.amplifyapp.com/)
**backend**: [server](https://n04hxdmwr1.execute-api.ap-south-1.amazonaws.com/)

## code explanation

### Database
1. Two tables are created: User and Pokemon.
2. User table has columns for userid and pokemonownername.
3. Pokemon table references userid from the User table and includes details about Pokémon and their actions.

### backend
**Setup**
1. Import all necessary libraries like Express.js, UUID, Mongoose, CORS, etc.
2. Apply middleware for CORS and JSON parsing.<br>
**Operations**<br>
Create CRUD operations for Pokémon:<br>
1. Create: Add a new Pokémon to the database.
2. Read: Fetch details of Pokémon from the database.
3. Update: Modify details of an existing Pokémon.
4. Delete: Remove a Pokémon from the database.<br>

Create and read operations for User:

1. Create: Add a new user to the database.
2. Read: Fetch user details from the database.

### frontend 
