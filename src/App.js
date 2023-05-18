import logo from './logo.svg';
import './App.css';
import Login from './Login';
import { Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <header className="">
      </header>

      <Routes>
        <Route path="/" element={<Login />} />      
      </Routes>

    </div>
  );
}

export default App;
