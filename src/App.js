import logo from './logo.svg';
import './App.css';
import Main from './Main';
import { Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <header className="">
      </header>

      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>

    </div>
  );
}

export default App;
