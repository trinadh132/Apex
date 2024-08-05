import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Addpockemon.module.css';

const AddPokemon = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pokemonOwnerName = queryParams.get('ownerName') || '';

  const [pokemonName, setPokemonName] = useState('');
  const [pokemonAbility, setPokemonAbility] = useState('');
  const [direction, setDirection] = useState('');
  const [initialPositionX, setInitialPositionX] = useState('');
  const [initialPositionY, setInitialPositionY] = useState('');
  const [speed, setSpeed] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(pokemonOwnerName);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all users
    fetch('http://localhost:5000/view-users')
      .then(response => response.json())
      .then(data => {
        const uniqueUsers = Array.from(new Set(data.map(user => user.pokemonOwnerName)));
        setUsers(uniqueUsers);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    // Fetch Pokémon names
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => {
        setPokemonNames(data.results.map(pokemon => pokemon.name));
      })
      .catch(error => {
        console.error('Error fetching Pokémon names:', error);
      });
  }, []);

  useEffect(() => {
    // Set selectedUser to pokemonOwnerName from query params
    if (pokemonOwnerName) {
      setSelectedUser(pokemonOwnerName);
    }
  }, [pokemonOwnerName]);

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

  const handleAddPokemon = (e) => {
    e.preventDefault();

    const newPokemon = {
      pokemonOwnerName: selectedUser,
      pokemonName,
      pokemonAbility,
      direction,
      initialPositionX,
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
        navigate(`/list-users/${selectedUser}`);
      })
      .catch(error => console.error('Error adding Pokémon:', error));
  };

  return (
    <div className={styles.container}>
      <h2>Add Pokémon</h2>
      <form onSubmit={handleAddPokemon}>
        <div>
          <label>Owner Name:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select Owner</option>
            {users.map((user, index) => (
              <option key={index} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Pokémon Name:</label>
          <select
            value={pokemonName}
            onChange={handlePokemonNameChange}
            required
          >
            <option value="">Select Pokémon</option>
            {pokemonNames.map(name => (
              <option key={name} value={name}>
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
            disabled={pokemonAbilities.length <= 1}
          >
            <option value="">Select Ability</option>
            {pokemonAbilities.map(ability => (
              <option key={ability} value={ability}>
                {ability}
              </option>
            ))}
          </select>
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
          <label>Speed:</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttonContainer}>
          
          <button type="submit" className={styles.addPokemonButton}>Add Pokémon</button>
        </div>
      </form>
    </div>
  );
};

export { AddPokemon };
