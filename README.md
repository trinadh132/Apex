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
1. First we have to create routing for the project do we install react-router-dom and create routes to the important components
2. first i have create home page in first.jsx where i added buttons play,create user and all players  to navigate to respective components using usenavigate hook
3. Upon clicking 'play,' the user navigates to the `home.jsx` component. This component uses `useEffect` to fetch the details of all users in the database. When a user selects a name from a `<select>` HTML tag, another `useEffect` hook fetches the Pokemon details for the selected user. The visibility of these details is managed by `useState`.

The Pokemon details are displayed as yellow dots, created using the `map` function. The `useState` hook is used to handle Pokemon actions such as "go," "flee," and "cease." 

- The "go" method contains a conditional statement where if "cease" is true (default is false), the position of the Pokemon doesn't change. If "cease" is false and the yellow dot is clicked, it becomes true, preventing movement. 
- If "cease" is false, the position changes based on the direction using CSS properties like `.top` and `.left`, adjusting them by the speed of the Pokemon.
- For "flee," the visibility of the yellow dot is toggled.
This setup allows for dynamic interaction with the Pokemon's position and visibility based on user actions.
4. Upon clicking the 'create user' button, a form appears where details must be filled according to the labels. The dropdown values for Pokemon are fetched using useEffect upon mounting. When a Pokemon name is selected, its ability details are fetched. After filling in all the details, clicking the 'create' button submits the form. The data is then sent to the database using the POST method. Upon successful addition, an alert is displayed saying "added successfully," and the user is navigated to listpokemonusercomponents.jsx.
5. In listPokemonUsers, we first fetch the details of the Pokemon. Then, we create a table to display these details using the map function. Each Pokemon entry in the table has "edit" and "delete" options.

- When the delete icon is clicked, window.confirm is used to confirm the deletion. If confirmed, the Pokemon is deleted from the database using    the DELETE method in fetch.
- When the edit icon is clicked, we navigate to editlistpokemon.jsx with the pokemonId as a parameter.
- When the Add button is clicked,we navigate to addpokemon.jsx
6. In editPokemon.jsx, we fetch the Pokemon details using the pokemonId from the params and set these values to the text fields. When the fields are changed, the updated values are stored in useState. Upon submitting the form, we use the PATCH method in fetch to update the details, and then navigate back to listPokemonUsers.jsx.
7. In addPokemon.jsx, we have the same form as in createPokemon, but with an additional dropdown containing all the users. When the form is submitted, we use the POST method in fetch to add the Pokemon.
8. On the home page, there is a button labeled "All Users." By clicking it, we navigate to allUsers.jsx, where we fetch all the users and their Pokemon using useEffect upon mounting. We use an HTML table element to display the details of the users and their Pokemon.


