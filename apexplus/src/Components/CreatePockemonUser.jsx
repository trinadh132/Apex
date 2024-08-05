import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreatePockemonUser.module.css';

const CreatePockemonUser = () => {
  const [pokemonOwnerName, setPokemonOwnerName] = useState('');
  const [direction, setDirection] = useState('');
  const [initialPositionX, setInitialPositionX] = useState(0);
  const [initialPositionY, setInitialPositionY] = useState(0);
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonAbility, setPokemonAbility] = useState('');
  const [speed, setSpeed] = useState(0);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [pokemonAbilities, setPokemonAbilities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Pokémon names directly from the PokéAPI
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => {
        setPokemonNames(data.results.map(pokemon => pokemon.name));
      })
      .catch(error => {
        console.error('Error fetching Pokémon names:', error);
      });
  }, []);

  const handlePokemonNameChange = (e) => {
    setPokemonName(e.target.value);
    // Fetch Pokémon abilities when a Pokémon name is selected
    fetch(`https://pokeapi.co/api/v2/pokemon/${e.target.value}`)
      .then(response => response.json())
      .then(data => {
        setPokemonAbilities(data.abilities.map(ability => ability.ability.name));
        if (data.abilities.length === 1) {
          setPokemonAbility(data.abilities[0].ability.name);
        } else {
          setPokemonAbility('');
        }
      })
      .catch(error => {
        console.error('Error fetching Pokémon abilities:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPokemon = {
      pokemonOwnerName,
      direction,
      initialPositionX,
      pokemonName,
      pokemonAbility,
      initialPositionY,
      speed
    };
    fetch('http://localhost:5000/add-pokemon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPokemon)
    })
      .then(response => response.json())
      .then(data => {
        alert('Pokémon added successfully');
        navigate(`/list-users/${pokemonOwnerName}`);
      })
      .catch(error => {
        console.error('Error adding Pokémon:', error);
      });
  };

  return (
    <div className={styles.container}>
      <h2>Create Pokémon User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Owner Name:</label>
          <input
            type="text"
            value={pokemonOwnerName}
            onChange={(e) => setPokemonOwnerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Direction:</label>
          <input
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Initial Position X:</label>
          <input
            type="number"
            value={initialPositionX}
            onChange={(e) => setInitialPositionX(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Initial Position Y:</label>
          <input
            type="number"
            value={initialPositionY}
            onChange={(e) => setInitialPositionY(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Pokémon Name:</label>
          <select
            value={pokemonName}
            onChange={handlePokemonNameChange}
            required
          >
            <option value="">Select Pokémon</option>
            {pokemonNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Pokémon Ability:</label>
          <select
            value={pokemonAbility}
            onChange={(e) => setPokemonAbility(e.target.value)}
            required
          >
            <option value="">Select Ability</option>
            {pokemonAbilities.map((ability, index) => (
              <option key={index} value={ability}>
                {ability}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Speed:</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttonContainer}>
          
          <button type="submit" className={styles.createButton}>Create</button>
        </div>
      </form>
    </div>
  );
};

export { CreatePockemonUser };
