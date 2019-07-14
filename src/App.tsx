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
              <>
                <div
                  style={{
                    height: 700,
                    width: 700,
                    background: '#CDCDCD',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      height: 40,
                      width: 20,
                      background: '#232323',
                      transform: `translate(${position.x}px, -${position.y * 100}px)`
                    }}
                  />
                </div>
                <pre>
                {JSON.stringify(position, null, 2)}
                </pre>
              </>
            )}
          </CharacterPositionConsumer>
        </div>
      </CharacterPositionProvider>
    );
  }
}
