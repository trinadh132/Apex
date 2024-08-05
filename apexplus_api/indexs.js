const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://ktrinadhgv369:Giresh%40369@dns.cfujzaa.mongodb.net/apexplus?retryWrites=true&w=majority&appName=dns', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to the MongoDB database');
}).catch((err) => {
  console.error('Error connecting to the database:', err.stack);
});

//==========================================================================================================
// Define Mongoose Schemas and Models

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, unique: true },
  pokemonOwnerName: { type: String, required: true }
});

const pokemonSchema = new mongoose.Schema({
  pokemonId: { type: String, default: uuidv4, unique: true },
  userId: { type: String, ref: 'User' },
  pokemonName: { type: String, required: true },
  pokemonAbility: String,
  initialPositionX: Number,
  initialPositionY: Number,
  speed: Number,
  direction: String
});

const User = mongoose.model('User', userSchema);
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

//==========================================================================================================
// Route to add a Pokémon
app.post('/add-pokemon', async (req, res) => {
  try {
    const {
      pokemonOwnerName,
      direction,
      initialPositionX,
      pokemonName,
      pokemonAbility,
      initialPositionY,
      speed
    } = req.body;

    let user = await User.findOne({ pokemonOwnerName });

    if (!user) {
      user = new User({ pokemonOwnerName });
      await user.save();
    }

    const pokemon = new Pokemon({
      userId: user.userId,
      pokemonName,
      pokemonAbility,
      initialPositionX,
      initialPositionY,
      speed,
      direction
    });

    await pokemon.save();

    res.status(201).json({ message: 'Pokémon added successfully' });
  } catch (err) {
    console.error('Error adding Pokémon:', err);
    res.status(500).json({ message: 'Error adding Pokémon' });
  }
});

//=================================================================================================================================================================
// PATCH endpoint to update a Pokémon
app.patch('/update-pokemon/:pokemonId', async (req, res) => {
  const { pokemonId } = req.params;
  const { pokemonName, pokemonAbility, initialPositionX, initialPositionY, speed, direction } = req.body;

  try {
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { pokemonId },
      {
        pokemonName,
        pokemonAbility,
        initialPositionX,
        initialPositionY,
        speed,
        direction
      },
      { new: true }
    );

    if (updatedPokemon) {
      res.status(200).json({ message: 'Pokémon updated successfully' });
    } else {
      res.status(404).json({ message: 'Pokémon not found' });
    }
  } catch (err) {
    console.error('Error updating Pokémon:', err);
    res.status(500).json({ message: 'Error updating Pokémon' });
  }
});

//========================================================================================================================================
// DELETE endpoint to delete a Pokémon
app.delete('/delete-pokemon/:pokemonId', async (req, res) => {
  const { pokemonId } = req.params;

  try {
    const deletedPokemon = await Pokemon.findOneAndDelete({ pokemonId });

    if (deletedPokemon) {
      res.status(200).json({ message: 'Pokémon deleted successfully' });
    } else {
      res.status(404).json({ message: 'Pokémon not found' });
    }
  } catch (err) {
    console.error('Error deleting Pokémon:', err);
    res.status(500).json({ message: 'Error deleting Pokémon' });
  }
});

//======================================================================================================  
// Endpoint to view Pokémon based on pokemonOwnerName
app.get('/view-pokemon/:pokemonOwnerName', async (req, res) => {
  const { pokemonOwnerName } = req.params;

  try {
    const user = await User.findOne({ pokemonOwnerName });

    if (user) {
      const pokemons = await Pokemon.find({ userId: user.userId });
      res.status(200).json(pokemons);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching Pokémon:', err);
    res.status(500).json({ message: 'Error fetching Pokémon' });
  }
});

//------------------------------------------------------------------------
app.get('/view-pokemon-details/:pokemonId', async (req, res) => {
    const { pokemonId } = req.params;
  
    try {
      // Fetch the Pokémon document
      const pokemon = await Pokemon.findOne({ pokemonId });
  
      if (pokemon) {
        const user = await User.findOne({ userId: pokemon.userId });
        const result = {
          ...pokemon._doc,
          pokemonOwnerName: user ? user.pokemonOwnerName : 'User not found'
        };
  
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'Pokémon not found' });
      }
    } catch (err) {
      console.error('Error fetching Pokémon details:', err);
      res.status(500).json({ message: 'Error fetching Pokémon details' });
    }
  });
  

//--------------------------------------------------------------------------------------------------

app.get('/view-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

//-------------------------------------------------------------------------------------------------------
// to get all usernames and their Pokémon

app.get('/view-all-users', async (req, res) => {
  try {
    const users = await User.find({});

    const result = await Promise.all(users.map(async user => {
      const pokemons = await Pokemon.find({ userId: user.userId });
      return {
        userId: user.userId,
        pokemonOwnerName: user.pokemonOwnerName,
        pokemons
      };
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching users and Pokémon:', err);
    res.status(500).json({ message: 'Error fetching users and Pokémon' });
  }
});

//===============================================================================================================  
// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Welcome to apex_plus' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
