import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

import "./App.css";
import AnimatedRoutes from "./components/common/AnimatedRoutes";

export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const getData = async () => {
    try {
      const user = await JSON.parse(localStorage.getItem("user"));
      if (user && user !== undefined) {
        setUserData(user);
        setUserLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, userLoggedIn }}>
      <div className="App">
        <Router>
          <div className="content">
            <AnimatedRoutes />
          </div>
          <footer className="bg-light text-center text-lg-start">
            <div className="text-center p-3">
              © {date} Copyright: learn App
            </div>
          </footer>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;


