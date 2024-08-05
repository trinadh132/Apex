import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/EditPockemon.module.css';

const EditPockemon = () => {
  const { pokemonId } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState({
    pokemonName: '',
    pokemonAbility: '',
    initialPositionX: 0,
    initialPositionY: 0,
    speed: 0,
    direction: ''
  });
  const [pokemonNames, setPokemonNames] = useState([]);
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the Pokémon details for editing
    fetch(`http://localhost:5000/view-pokemon-details/${pokemonId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPokemonDetails(data);
        fetchPokemonAbilities(data.pokemonName);
      })
      .catch(error => console.error('Error fetching Pokémon details:', error));

    // Fetch Pokémon names directly from the PokéAPI
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => {
        setPokemonNames(data.results.map(pokemon => pokemon.name));
      })
      .catch(error => {
        console.error('Error fetching Pokémon names:', error);
      });
  }, [pokemonId]);

  const fetchPokemonAbilities = (name) => {
    // Fetch Pokémon abilities when a Pokémon name is selected
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(response => response.json())
      .then(data => {
        const abilities = data.abilities.map(ability => ability.ability.name);
        setPokemonAbilities(abilities);
        if (abilities.length === 1) {
          setPokemonDetails(prevState => ({ ...prevState, pokemonAbility: abilities[0] }));
        } else {
          setPokemonDetails(prevState => ({ ...prevState, pokemonAbility: '' }));
        }
      })
      .catch(error => {
        console.error('Error fetching Pokémon abilities:', error);
      });
  };

  const handlePokemonNameChange = (e) => {
    const name = e.target.value;
    setPokemonDetails(prevState => ({ ...prevState, pokemonName: name }));
    fetchPokemonAbilities(name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPokemonDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/update-pokemon/${pokemonId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pokemonDetails)
    })
      .then(response => response.json())
      .then(data => {
        alert('Pokémon updated successfully');
        navigate(`/list-users/${pokemonDetails.pokemonOwnerName}`);
      })
      .catch(error => {
        console.error('Error updating Pokémon:', error);
      });
  };

  return (
    <div className={styles.container}>
      <h2>Edit Pokémon</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pokémon Name:</label>
          <select
            name="pokemonName"
            value={pokemonDetails.pokemonName}
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
            name="pokemonAbility"
            value={pokemonDetails.pokemonAbility}
            onChange={handleInputChange}
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
          <label>Initial Position X:</label>
          <input
            type="number"
            name="initialPositionX"
            value={pokemonDetails.initialPositionX}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Initial Position Y:</label>
          <input
            type="number"
            name="initialPositionY"
            value={pokemonDetails.initialPositionY}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Speed:</label>
          <input
            type="number"
            name="speed"
            value={pokemonDetails.speed}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Direction:</label>
          <input
            type="text"
            name="direction"
            value={pokemonDetails.direction}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export { EditPockemon };
