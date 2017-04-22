import React from 'react';
import FileIcon from '../assets/file.svg';

class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      mouseX: 0,
      mouseY: 0,
      style: {}
    };

    this._mouseX = 0;
    this._mouseY = 0;


    this._moveListener = (e) => {
      const { isDragging, mouseX, mouseY } = this.state;
      this._mouseX = e.mouseX;
      this._mouseY = e.mouseY;

      if (isDragging) {
        const left = e.mouseX - mouseX;
        const top = e.mouseY - mouseY;

        this.setState({
          style: {
            position: 'relative',
            left,
            top
          }
        });
      }
    };

    this._upListener = () => {
      if (this.state.isDragging) {
        this.props.monitor.toggleDragging(false);

        this.props.dragEnd();

        this.setState({
          isDragging: false,
          style: {}
        });
      }
    };
  }

  componentDidMount() {
    const emitter = this.props.monitor.getEmitter();
    emitter.on('move', this._moveListener);
    emitter.on('up', this._upListener);
  }

  componentWillUnmount () {
    const emitter = this.props.monitor.getEmitter();
    emitter.removeListener('move', this._moveListener);
    emitter.removeListener('up', this._upListener);
  }

  dragStart(e) {
    if (!this.props.monitor._isDragging) {
      this.props.monitor.toggleDragging(true);
      const top = e.target.offsetTop;

      this.props.dragStart({
        index: this.props.index,
        item: { name: this.props.name, type: 'file' }
      });

      this.setState({
        isDragging: true,
        style: {
          position: 'relative',
        },
        mouseX: this._mouseX,
        mouseY: top - 8
      });
    }
  }

  render() {
    return (
      <div className="file"
        style={this.state.style}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => this.dragStart(e)}>
        <FileIcon className="file-icon" />
        {this.props.name}
      </div>
    );
  }
}

export default File;
