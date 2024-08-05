import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import styles from '../styles/ListPockemonUsers.module.css';

const ListPockemonUsers = () => {
  const [pokemons, setPokemons] = useState([]);
  const { pokemonOwnerName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of Pokémon for the specific user
    fetch(`http://localhost:5000/view-pokemon/${pokemonOwnerName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setPokemons(data))
      .catch(error => console.error('Error fetching Pokémon:', error));
  }, [pokemonOwnerName]);

  const handleAddPokemon = () => {
    navigate(`/add-pokemon/${pokemonOwnerName}`);
  };

  const handleEditPokemon = (pokemonId) => {
    navigate(`/edit-pokemon/${pokemonId}`);
  };

  const handleDeletePokemon = (pokemonId) => {
    if (window.confirm('Are you sure you want to delete this Pokémon?')) {
      fetch(`http://localhost:5000/delete-pokemon/${pokemonId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.message === 'Pokémon deleted successfully') {
            setPokemons(pokemons.filter(pokemon => pokemon.pokemonId !== pokemonId));
          }
        })
        .catch(error => console.error('Error deleting Pokémon:', error));
    }
  };

  const pokemonCount = pokemons.length;

  return (
    <div className={styles.container}>
      <h2>List of Pokémon</h2>
      <p className={styles.pokemonCount}>Number of Pokémon: {pokemonCount}</p>
      <button onClick={handleAddPokemon}>Add Pokémon</button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Pokémon Name</th>
            <th>Ability</th>
            <th>Initial Position X</th>
            <th>Initial Position Y</th>
            <th>Speed</th>
            <th>Direction</th>
            <th>No. of Pokémon</th>
            
          </tr>
        </thead>
        <tbody>
          {pokemons.map(pokemon => (
            <tr key={pokemon.pokemonId}>
              <td>{pokemon.pokemonName}</td>
              <td>{pokemon.pokemonAbility}</td>
              <td>{pokemon.initialPositionX}</td>
              <td>{pokemon.initialPositionY}</td>
              <td>{pokemon.speed}</td>
              <td>{pokemon.direction}</td>
              
              <td>
                <div className={styles.buttonContainer}>
                  <FaEdit
                    className={styles.editIcon}
                    onClick={() => handleEditPokemon(pokemon.pokemonId)}
                  />
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={() => handleDeletePokemon(pokemon.pokemonId)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ListPockemonUsers };
