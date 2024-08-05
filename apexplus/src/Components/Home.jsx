import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [pokemonPositions, setPokemonPositions] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

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
    if (selectedUser) {
      // Fetch Pokémon for the selected user
      fetch(`http://localhost:5000/view-pokemon/${selectedUser}`)
        .then(response => response.json())
        .then(data => {
          setPokemons(data);
          const positions = data.reduce((acc, pokemon) => {
            acc[pokemon.pokemonId] = {
              left: pokemon.initialPositionX,
              top: pokemon.initialPositionY,
              visible: true,
              frozen: false
            };
            return acc;
          }, {});
          setPokemonPositions(positions);
        })
        .catch(error => console.error('Error fetching Pokémon:', error));
    }
  }, [selectedUser]);

  const handleGo = () => {
    if (isFrozen) return; // If Pokémon are frozen, do nothing

    const newPositions = { ...pokemonPositions };
    pokemons.forEach(pokemon => {
      const speed = pokemon.speed;
      const direction = pokemon.direction.toLowerCase();
      if (direction === 'north') newPositions[pokemon.pokemonId].top -= speed;
      if (direction === 'south') newPositions[pokemon.pokemonId].top += speed;
      if (direction === 'east') newPositions[pokemon.pokemonId].left += speed;
      if (direction === 'west') newPositions[pokemon.pokemonId].left -= speed;

      // Ensure Pokémon is within bounds
      if (
        newPositions[pokemon.pokemonId].left < 0 ||
        newPositions[pokemon.pokemonId].left > 1000 || // Updated width
        newPositions[pokemon.pokemonId].top < 0 ||
        newPositions[pokemon.pokemonId].top > 350 // Updated height
      ) {
        newPositions[pokemon.pokemonId].visible = false;
      } else {
        newPositions[pokemon.pokemonId].visible = true;
      }
    });
    setPokemonPositions(newPositions);
  };

  const handleFlee = () => {
    setIsVisible(!isVisible);
  };

  const handleCease = () => {
    setIsFrozen(!isFrozen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dropdownContainer}>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">List of Pokémon Owner</option>
          {users.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Number of Pokémon</th>
                <th>Ability of Pokémon</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              {pokemons.map(pokemon => (
                <tr key={pokemon.pokemonId}>
                  <td>{pokemon.pokemonName}</td>
                  <td>{pokemon.pokemonAbility}</td>
                  <td>{pokemon.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className={styles.buttonContainer}>
        <button onClick={handleGo} className={styles.button}>Pokémon Go</button>
        <button onClick={handleFlee} className={styles.button}>Pokémon Flee</button>
        <button onClick={handleCease} className={styles.button}>
          {isFrozen ? 'Resume' : 'Pokémon Cease'}
        </button>
      </div>
      <div className={styles.pokemonField}>
        {pokemons.map(pokemon => (
          <div
            key={pokemon.pokemonId}
            className={styles.pokemon}
            style={{
              left: `${pokemonPositions[pokemon.pokemonId]?.left}px`,
              top: `${pokemonPositions[pokemon.pokemonId]?.top}px`,
              display: pokemonPositions[pokemon.pokemonId]?.visible && isVisible ? 'block' : 'none'
            }}
          >
            🟡
          </div>
        ))}
      </div>
    </div>
  );
};

export { Home };
