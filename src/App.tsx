// src/App.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { AnimeProvider } from "./AnimeContext";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <AnimeProvider>
        <Navbar />
        <Outlet />
      </AnimeProvider>
    </UserProvider>
  );
}

export default App;
