import React, { useState, useEffect } from "react";
import { Waveform } from "@uiball/loaders"
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
import NewSong from "./components/SongEditor/NewSong";
import NewInst from "./components/InstEditor/NewInst"

function App() {
  const loader = Waveform
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="container">
      <Navigation isLoaded={isLoaded} />
      <div className="main">
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/home">
            <Home loader={loader}/>
          </Route>
          <Route path="/songs/:id">
            <SongEditor loader={loader}/>
          </Route>
          <Route exact path="/songs">
            <NewSong />
          </Route>
          <Route path="/instruments/:id">
            <InstEditor loader={loader}/>
          </Route>
          <Route exact path="/instruments">
            <NewInst />
          </Route>
        </Switch>
      )}
      </div>
    </div>
  );
}

export default App;
