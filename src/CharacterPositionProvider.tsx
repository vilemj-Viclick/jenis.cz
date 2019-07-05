import React from 'react';

const g = 9.806;
const jumpDurationInSeconds = 1.3;

interface ICharacterPosition {
  x: number;
  y: number;
  dx: number;
  dy: number;
  jumpStart: number;
  isJumping: boolean;
  isEndingJump: boolean;
}

const defaultState: ICharacterPosition = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  jumpStart: 0,
  isJumping: false,
  isEndingJump: false,
};

const CharacterPositionContext = React.createContext<ICharacterPosition>(defaultState);

export const CharacterPositionConsumer = CharacterPositionContext.Consumer;

export class CharacterPositionProvider extends React.PureComponent<{}, ICharacterPosition> {
  static displayName = 'CharacterPositionProvider';

  private _jumpInterval: null | number = null;

  state: ICharacterPosition = defaultState;

  componentDidMount(): void {
    window.addEventListener('keyup', this._handleKeyUp);
    window.addEventListener('keydown', this._handleKeyDown);
  }

  componentWillUnmount(): void {
    window.removeEventListener('keyup', this._handleKeyUp);
    window.removeEventListener('keydown', this._handleKeyDown);
  }

  _handleKeyUp: EventListener = (event) => {
    switch ((event as KeyboardEvent).key) {
      case 'ArrowUp': {
        this._shortCircuitJump();
        break;
      }
      case 'ArrowLeft': {

        break;
      }
      case 'ArrowRight': {

        break;
      }
      case 'ArrowDown': {

        break;
      }
      default: {
        return null;
      }
    }
  };

  _handleKeyDown: EventListener = (event) => {
    switch ((event as KeyboardEvent).key) {
      case 'ArrowUp': {
        this._startJump();
        break;
      }
      case 'ArrowLeft': {

        break;
      }
      case 'ArrowRight': {

        break;
      }
      case 'ArrowDown': {

        break;
      }
      default: {
        return null;
      }
    }
  };

  _shortCircuitJump = (): void => {
    this.setState(() => ({
      isEndingJump: false,
    }));
  };

  _jumpFunction = (timeStart: number, now: number) => {
    // f : x -> -x^2 + 2*x;
    // f': x -> -2x + 2;
    const timeDiffInSeconds = (now - timeStart) / 1000;
    const nextY = timeDiffInSeconds * timeDiffInSeconds * -1 + jumpDurationInSeconds * timeDiffInSeconds;
    return {
      y: nextY > 0 ? nextY : 0,
      dy: nextY > 0 ? -jumpDurationInSeconds * timeDiffInSeconds + jumpDurationInSeconds : 0,
    };
  };

  _endJump = (): void => {
    if (this._jumpInterval) {
      window.clearInterval(this._jumpInterval);
      this._jumpInterval = null;
      this.setState(()=>({
        isJumping:false,
      }));
    }
  };

  _continueJump = (): void => {
    this.setState((oldState) => {
      const {
        jumpStart,
      } = oldState;
      const { dy, y } = this._jumpFunction(jumpStart, Date.now());
      if (y <= 0) {
        this._endJump();
      }
      return {
        y,
        dy,
      };
    });
  };

  _startJump = (): void => {
    if (this.state.isJumping) {
      return;
    }
    this.setState(() => ({
      jumpStart: Date.now(),
      isJumping: true,
    }), () => {
      this._jumpInterval = window.setInterval(this._continueJump, 16);
    });
  };

  render() {
    return (
      <CharacterPositionContext.Provider
        value={this.state}
      >
        {this.props.children}
      </CharacterPositionContext.Provider>
    );
  }
}
