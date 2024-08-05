import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreatePockemonUser } from "./Components/CreatePockemonUser";
import { ListPockemonUsers } from "./Components/ListPockemonUsers";
import { EditPockemon } from "./Components/EditListPockemon";
import { AddPokemon } from "./Components/Addpokemon";
import { AllUsers } from './Components/AllUsers';
import { Home } from "./Components/Home";
import { First } from "./Components/First";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-pokemonuser" element={<CreatePockemonUser />} />
          <Route path="/list-users/:pokemonOwnerName" element={<ListPockemonUsers />} />
          <Route path="/edit-pokemon/:pokemonId" element={<EditPockemon />} />
          <Route path="/add-pokemon/:ownerName" element={<AddPokemon />} />
          <Route path="/all-users" element={<AllUsers />} />
        </Routes>
      </Router>
  );
}

export default App;
