import { Outlet } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from 'react';
import { useAppDispatch } from './config/hooks';
import { getProjects } from './components/projectSlice';
import Navbar from './components/Navbar';

function App() {
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProjects());
  },[])

  return (
    <>
      <Navbar/>
      <main className="container row mx-auto bg-dark text-light mt-3 p-3 rounded">
        <Outlet />
      </main>
    </>
  )
}

export default App
