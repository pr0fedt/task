import React from 'react';
import Monitor from '../lib/monitor.js';

class DragBetween extends React.Component {
  constructor(props) {
    super(props);

    const monitor = new Monitor;

    this._onMouseUpHandler = () => {
      monitor.getEmitter().emit('up');
    };

    this._onMouseMoveHandler = (e) => {
      const { clientX, clientY } = e;

      monitor.getEmitter().emit('move', {
        mouseX: clientX,
        mouseY: clientY
      });
    };

    this._monitor = monitor;
  }

  componentDidMount() {
    window.addEventListener('mousemove', this._onMouseMoveHandler);
    window.addEventListener('mouseup', this._onMouseUpHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this._onMouseMoveHandler, false);
    window.removeEventListener('mouseup', this._onMouseUpHandler, false);
  }

  render() {
    const monitor = this._monitor;

    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, { monitor });
        })}
      </div>
    );
  }
}

export default DragBetween;
