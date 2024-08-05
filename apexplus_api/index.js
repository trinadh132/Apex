const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Added cors package
const app = express();

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'Trinadh@123',
  database: 'apex_plus'
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error in connecting to the database:', err.stack);
    return;
  }
  console.log('Successfully connected to the database');
  connection.release();
});
//==========================================================================================================
// Route to add a Pokémon
app.post('/add-pokemon', (req, res) => {
  const {
    pokemonOwnerName,
    direction,
    initialPositionX,
    pokemonName,
    pokemonAbility,
    initialPositionY,
    speed
  } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ message: 'Error connecting to the database' }); // Changed to res.json
      return;
    }

    // Insert user if not exists
    const insertUserQuery = `
      INSERT INTO Users (pokemonOwnerName)
      VALUES (?)
      ON DUPLICATE KEY UPDATE pokemonOwnerName = pokemonOwnerName;
    `;

    connection.query(insertUserQuery, [pokemonOwnerName], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        connection.release();
        res.status(500).json({ message: 'Error inserting user' }); // Changed to res.json
        return;
      }

      // Get the userId of the inserted/updated user
      const userIdQuery = `
        SELECT userId FROM Users WHERE pokemonOwnerName = ?
      `;
      connection.query(userIdQuery, [pokemonOwnerName], (err, results) => {
        if (err) {
          console.error('Error fetching userId:', err);
          connection.release();
          res.status(500).json({ message: 'Error fetching userId' }); // Changed to res.json
          return;
        }

        const userId = results[0].userId;

        // Insert Pokémon
        const insertPokemonQuery = `
          INSERT INTO Pokemon (userId, pokemonName, pokemonAbility, initialPositionX, initialPositionY, speed, direction)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        connection.query(insertPokemonQuery, [userId, pokemonName, pokemonAbility, initialPositionX, initialPositionY, speed, direction], (err, results) => {
          connection.release();
          if (err) {
            console.error('Error inserting Pokémon:', err);
            res.status(500).json({ message: 'Error inserting Pokémon' }); // Changed to res.json
          } else {
            res.status(201).json({ message: 'Pokémon added successfully' }); // Changed to res.json
          }
        });
      });
    });
  });
});
//=================================================================================================================================================================
// PATCH endpoint to update a Pokémon
app.patch('/update-pokemon/:pokemonId', (req, res) => {
    const { pokemonId } = req.params; // Ensure pokemonId is correctly extracted
    const { pokemonName, pokemonAbility, initialPositionX, initialPositionY, speed, direction } = req.body;
  
    const updatePokemonQuery = `
      UPDATE Pokemon 
      SET pokemonName = ?, pokemonAbility = ?, initialPositionX = ?, initialPositionY = ?, speed = ?, direction = ?
      WHERE pokemonId = ?;
    `;
  
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Error connecting to the database' });
        return;
      }
  
      connection.query(updatePokemonQuery, [pokemonName, pokemonAbility, initialPositionX, initialPositionY, speed, direction, Number(pokemonId)], (err, results) => { // Added Number(pokemonId)
        connection.release();
        if (err) {
          console.error('Error updating Pokémon:', err);
          res.status(500).json({ message: 'Error updating Pokémon' });
        } else {
          res.status(200).json({ message: 'Pokémon updated successfully' });
        }
      });
    });
  });
  
  
  //========================================================================================================================================
  // DELETE endpoint to delete a Pokémon
  app.delete('/delete-pokemon/:pokemonId', (req, res) => {
    const { pokemonId } = req.params;
  
    const deletePokemonQuery = `
      DELETE FROM Pokemon 
      WHERE pokemonId = ?;
    `;
  
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Error connecting to the database' });
        return;
      }
  
      connection.query(deletePokemonQuery, [pokemonId], (err, results) => {
        connection.release();
        if (err) {
          console.error('Error deleting Pokémon:', err);
          res.status(500).json({ message: 'Error deleting Pokémon' });
        } else {
          res.status(200).json({ message: 'Pokémon deleted successfully' });
        }
      });
    });
  });
//======================================================================================================  
// Endpoint to view Pokémon based on pokemonOwnerName
app.get('/view-pokemon/:pokemonOwnerName', (req, res) => {
    const { pokemonOwnerName } = req.params;
  
    const viewPokemonQuery = `
      SELECT p.*, (SELECT COUNT(*) FROM Pokemon WHERE userId = u.userId) as pokemonCount
      FROM Pokemon p
      JOIN Users u ON p.userId = u.userId
      WHERE u.pokemonOwnerName = ?;
    `;
  
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Error connecting to the database' });
        return;
      }
  
      connection.query(viewPokemonQuery, [pokemonOwnerName], (err, results) => {
        connection.release();
        if (err) {
          console.error('Error fetching Pokémon:', err);
          res.status(500).json({ message: 'Error fetching Pokémon' });
        } else {
          res.status(200).json(results);
        }
      });
    });
  });
  
//------------------------------------------------------------------------
  app.get('/view-pokemon-details/:pokemonId', (req, res) => {
    const { pokemonId } = req.params;
  
    const viewPokemonDetailsQuery = `
      SELECT p.*, u.pokemonOwnerName FROM Pokemon p
      JOIN Users u ON p.userId = u.userId
      WHERE p.pokemonId = ?;
    `;
  
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Error connecting to the database' });
        return;
      }
  
      connection.query(viewPokemonDetailsQuery, [pokemonId], (err, results) => {
        connection.release();
        if (err) {
          console.error('Error fetching Pokémon details:', err);
          res.status(500).json({ message: 'Error fetching Pokémon details' });
        } else {
          res.status(200).json(results[0]);
        }
      });
    });
  });

  //--------------------------------------------------------------------------------------------------

  // Endpoint to view all users name 
app.get('/view-users', (req, res) => {
    const viewUsersQuery = `
      SELECT * FROM Users;
    `;
  
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Error connecting to the database' });
        return;
      }
  
      connection.query(viewUsersQuery, (err, results) => {
        connection.release();
        if (err) {
          console.error('Error fetching users:', err);
          res.status(500).json({ message: 'Error fetching users' });
        } else {
          res.status(200).json(results);
        }
      });
    });
  });
  //-------------------------------------------------------------------------------------------------------
  // to get all usernames and his pockemons
  
// Endpoint to view all users and their Pokémon
app.get('/view-all-users', (req, res) => {
    const viewAllUsersQuery = `
      SELECT u.userId, u.pokemonOwnerName, 
             p.pokemonId, p.pokemonName, p.pokemonAbility, 
             p.initialPositionX, p.initialPositionY, 
             p.speed, p.direction
      FROM Users u
      LEFT JOIN Pokemon p ON u.userId = p.userId;
    `;
  
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Error connecting to the database' });
        return;
      }
  
      connection.query(viewAllUsersQuery, (err, results) => {
        connection.release();
        if (err) {
          console.error('Error fetching users and Pokémon:', err);
          res.status(500).json({ message: 'Error fetching users and Pokémon' });
          return;
        }
  
        // Process results to group Pokémon by user
        const users = results.reduce((acc, row) => {
          const user = acc.find(u => u.userId === row.userId);
          const pokemon = {
            pokemonId: row.pokemonId,
            pokemonName: row.pokemonName,
            pokemonAbility: row.pokemonAbility,
            initialPositionX: row.initialPositionX,
            initialPositionY: row.initialPositionY,
            speed: row.speed,
            direction: row.direction
          };
  
          if (user) {
            user.pokemons.push(pokemon);
          } else {
            acc.push({
              userId: row.userId,
              pokemonOwnerName: row.pokemonOwnerName,
              pokemons: [pokemon]
            });
          }
  
          return acc;
        }, []);
  
        res.status(200).json(users);
      });
    });
  });
  
//===============================================================================================================  
// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Welcome to apex_plus' }); // Changed to res.json
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
