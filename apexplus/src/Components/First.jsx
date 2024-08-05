import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/First.module.css';

const First = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>POKéMON Game</h1>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => navigate('/home')}>Play</button>
        <button className={styles.button} onClick={() => navigate('/create-pokemonuser')}>Create user</button>
        <button className={styles.button} onClick={() => navigate('/all-users')}>All players</button>
      </div>
    </div>
  );
};

export { First };
