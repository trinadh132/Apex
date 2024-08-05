import React, { useState, useEffect } from 'react';
import styles from '../styles/AllUsers.module.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users and their Pokémon
    fetch('http://localhost:5000/view-all-users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className={styles.container}>
      <h2>All Users and their Pokémon</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Owner Name</th>
            <th>Pokémon Name</th>
            <th>Ability</th>
            <th>Initial Position X</th>
            <th>Initial Position Y</th>
            <th>Speed</th>
            <th>Direction</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            user.pokemons.length > 0 ? (
              user.pokemons.filter(pokemon => pokemon.pokemonId).map((pokemon, index) => (
                <tr key={pokemon.pokemonId}>
                  {index === 0 && <td rowSpan={user.pokemons.filter(p => p.pokemonId).length}>{user.pokemonOwnerName}</td>}
                  <td>{pokemon.pokemonName}</td>
                  <td>{pokemon.pokemonAbility}</td>
                  <td>{pokemon.initialPositionX}</td>
                  <td>{pokemon.initialPositionY}</td>
                  <td>{pokemon.speed}</td>
                  <td>{pokemon.direction}</td>
                </tr>
              ))
            ) : (
              <tr key={user.userId}>
                <td>{user.pokemonOwnerName}</td>
                <td colSpan="6">No Pokémon available</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { AllUsers };
