import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SongEditor from "./components/SongEditor";
import InstEditor from "./components/InstEditor";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="container">
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/songs/:id">
            <SongEditor />
          </Route>
          <Route path="/instruments/:id">
            <InstEditor />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
