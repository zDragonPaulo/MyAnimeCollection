// src/App.tsx
import { Outlet } from "react-router-dom";
import Navbar from './Components/Navbar';
import { AnimeProvider } from './AnimeContext';

function App() {
  return (
    <AnimeProvider>
      <Navbar />
      <Outlet />
    </AnimeProvider>
  );
}

export default App;
