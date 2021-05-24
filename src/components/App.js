import React from 'react';
import '../App.css';
import NavBar from './NavBar';
import { Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage'


function App() {

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="App">
        <Route exact path="/:page?" render={props => <NavBar {...props} />} />
        <Route path='/' exact component={ LandingPage }/>
      </div>
    </BrowserRouter>
  );

}

export default App
