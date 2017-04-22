import React from 'react';

class DropDown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="drop-down"
        style={{ display: this.props.visible ? 'inline-block' : 'none' }}>
        <p>{this.props.title}</p>
        <div className="drop-down-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DropDown;
