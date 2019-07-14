import React from 'react';

const gWhileUpIsHeld = 10; // m*s^-2 - Gravitational acceleration
const gAfterUpIsLetGo = 40; // m*s^-2 - Gravitational acceleration
const Vi = 5; // m*s - Initial speed
// const jumpDurationInSeconds = 0.8;

interface IPosition {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ICharacterPosition extends IPosition {
  jumpStart: number;
  isJumping: boolean;
  isEndingJump: boolean;
  timeUpKeyWasLetGo: number;
}

const defaultState: ICharacterPosition = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  jumpStart: 0,
  isJumping: false,
  isEndingJump: false,
  timeUpKeyWasLetGo: 0,
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
    this.setState(({ timeUpKeyWasLetGo, isJumping }) => {
      if (isJumping) {
        return {
          isEndingJump: true,
          timeUpKeyWasLetGo: timeUpKeyWasLetGo || Date.now(),
        }
      }
      return {} as any;
    });
  };

  _getElevationBasedOnTime = (initialElevation: number, initialSpeed: number, timeDiffInSeconds: number, g: number): number => {
    const nextY = -0.5 * g * timeDiffInSeconds * timeDiffInSeconds + initialSpeed * timeDiffInSeconds + initialElevation;
    return nextY;
  };

  _getSpeedBasedOnTime = (initialSpeed: number, timeDiffInSeconds: number, g: number) => {
    return -1 * g * timeDiffInSeconds + initialSpeed;
  };

  _jumpFunction = (timeStart: number, now: number, timeUpKeyWasLetGo: number) => {
    // f : x -> -g/2 * x^2 + Vi*x;
    // f': x -> -g*x + Vi;
    if (timeUpKeyWasLetGo) {
      const untilUpLetGoInSeconds = (timeUpKeyWasLetGo - timeStart) / 1000;
      const afterUWasLetGoInSeconds = (now - timeUpKeyWasLetGo) / 1000;
      const upLetGoElevation = this._getElevationBasedOnTime(0, Vi, untilUpLetGoInSeconds, gWhileUpIsHeld);
      const upLetGoSpeed = this._getSpeedBasedOnTime(Vi, untilUpLetGoInSeconds, gWhileUpIsHeld);
      const nextY = this._getElevationBasedOnTime(upLetGoElevation, upLetGoSpeed, afterUWasLetGoInSeconds, gAfterUpIsLetGo);
      return {
        y: nextY > 0 ? nextY : 0,
        dy: nextY > 0 ? this._getSpeedBasedOnTime(upLetGoSpeed, afterUWasLetGoInSeconds, gAfterUpIsLetGo) : 0,
      }
    }
    else {
      const timeDiffInSeconds = (now - timeStart) / 1000;
      const nextY = this._getElevationBasedOnTime(0, Vi, timeDiffInSeconds, gWhileUpIsHeld);
      return {
        y: nextY > 0 ? nextY : 0,
        dy: nextY > 0 ? this._getSpeedBasedOnTime(Vi, timeDiffInSeconds, gWhileUpIsHeld) : 0,
      };
    }
  };

  _endJump = (): void => {
    if (this._jumpInterval) {
      window.clearInterval(this._jumpInterval);
      this._jumpInterval = null;
      this.setState(() => ({
        isJumping: false,
        timeUpKeyWasLetGo: 0,
        isEndingJump: false,
      }));
    }
  };

  _continueJump = (): void => {
    this.setState((oldState) => {
      const {
        jumpStart,
        timeUpKeyWasLetGo,
      } = oldState;
      const { dy, y } = this._jumpFunction(jumpStart, Date.now(), timeUpKeyWasLetGo);
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
