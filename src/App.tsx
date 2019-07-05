import React from 'react';
import {
  CharacterPositionConsumer,
  CharacterPositionProvider,
} from './CharacterPositionProvider';
import logo from './logo.svg';
import './App.css';

export class App extends React.PureComponent {
  render() {
    return (
      <CharacterPositionProvider>
        <div className="App">
          <CharacterPositionConsumer>
            {position => (
              <pre>
              {JSON.stringify(position, null, 2)}
              </pre>
            )}
          </CharacterPositionConsumer>
        </div>
      </CharacterPositionProvider>
    );
  }
}
