import React, { Component } from 'react';
import './App.css';
import Demo from './Demo';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Demo/>
        </header>
      </div>
    );
  }
}

export default App;
