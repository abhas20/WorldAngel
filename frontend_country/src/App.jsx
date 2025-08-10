import './App.css'
import About from './pages/About'
import Country from './pages/Country'
import Contact from './pages/Contact'
import Home from './pages/Home'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ErrorPage from './pages/ErrorPage'
import CountryDetail from './components/layout/CountryDetail'
import Login from './pages/login'
import Profile from './pages/Profile'
import Signup from './pages/signup'
import ProtectedLayout from './components/layout/ProtectedLayout'
import { AuthProvider } from './auth/context/AuthProvider'
import PersistentLayount from './components/layout/PersistentLayount'
import ChangePassword from './pages/ChangePassword'
import { useEffect } from 'react'
import socket from './chat/socket'
import Chat from './pages/Chat'


const router=createBrowserRouter([

  {
    element:<AppLayout/>,
    errorElement:<ErrorPage/>,
    children:[
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'chat', element:<Chat/>},

      // Protected Routes
      {
        element: <ProtectedLayout />,
        errorElement: <ErrorPage />,
        children: [
          { path: 'country', element: <Country /> },
          { path: 'country/:id', element: <CountryDetail /> },
          { path: 'profile', element: <Profile /> },
          { path: 'change-password', element: <ChangePassword /> },
        ]
      }
    ]
}
  
])

function App() {

  useEffect(()=>{
    socket.on("connect", () => {
      console.log("Connected to socket server",socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    }
    );


    return ()=>{
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    }

  },[])


  return(
    <RouterProvider router={router}></RouterProvider>

  ) 
}

export default App
