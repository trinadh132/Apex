CREATE DATABASE apex_plus;
use apex_plus;

CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    pokemonOwnerName VARCHAR(100) NOT NULL
);

CREATE TABLE Pokemon (
    pokemonId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    pokemonName VARCHAR(100) NOT NULL,
    pokemonAbility VARCHAR(100),
    initialPositionX INT,
    initialPositionY INT,
    speed INT,
    direction VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

select * from Pokemon;

select * from Users;

