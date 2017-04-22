import React from 'react';
import classnames from 'classnames';
import File from './file.js';
import FolderIcon from '../assets/folder.svg';
import FolderCollapsedIcon from '../assets/folder-collapsed.svg';

class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      isDragging: false,
      isOver: false,
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

  renderChild(item, key) {
    switch(item.type) {
      case 'file':
        return (
          <File {...item}
            key={key}
            dragEnd={this.props.dragEnd}
            dragStart={this.props.dragStart}
            index={`${this.props.index}.${key}`}
            monitor={this.props.monitor} />
        );
      case 'folder':
        return (
          <Folder {...item}
            key={key}
            selected={this.props.selected}
            onSelect={this.props.onSelect}
            dragEnd={this.props.dragEnd}
            dragStart={this.props.dragStart}
            onDrop={this.props.onDrop}
            index={`${this.props.index}.${key}`}
            monitor={this.props.monitor} />
        );
      default:
        throw new Error(`wrong type ${item.type}`);
    }
  }

  dragStart(e) {
    if (!this.props.monitor._isDragging) {
      this.props.monitor.toggleDragging(true);
      const top = e.target.offsetTop;

      this.props.dragStart({
        index: this.props.index,
        item: { name: this.props.name, children: this.props.children, type: 'folder' }
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

  drop(e) {
    this.props.onDrop(this.props.index);
  }

  toggle(e) {
    const { isDragging, collapsed } = this.state;

    if (!isDragging) {
      e.stopPropagation();
      this.props.onSelect(!collapsed ? null : this.props.index);
      this.setState({ collapsed: !this.state.collapsed })
    }
  }

  over(e) {
    e.stopPropagation();
    this.setState({ isOver: true });
  }

  out(e) {
    e.stopPropagation();
    this.setState({ isOver: false });
  }

  render() {
    const { monitor } = this.props;
    const { collapsed, isOver, isDragging } = this.state;
    const className = classnames({
      folder: true,
      selected: this.props.selected === this.props.index,
      highlight: monitor._isDragging && !isDragging && isOver
    });

    return (
      <div className={className}
        style={this.state.style}
        onClick={(e) => this.toggle(e)}
        onMouseOver={(e) => this.over(e)}
        onMouseOut={(e) => this.out(e)}
        onMouseDown={(e) => this.dragStart(e)}
        onMouseUp={(e) => this.drop(e)}>
        {collapsed ? <FolderCollapsedIcon className="folder-icon" /> : <FolderIcon className="folder-icon" />}
        {this.props.name}
        {!this.state.collapsed && this.props.children ? this.props.children.map(
          (item, i) => this.renderChild(item, i)
        ) : null}
      </div>
    );
  }
}

export default Folder;
