import React from 'react';
import PropTypes from 'prop-types';
import AddIcon from '../assets/add.svg';
import OkIcon from '../assets/ok.svg';
import NoIcon from '../assets/no.svg';

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  getIcon() {
    switch (this.props.type) {
      case 'add':
        return <AddIcon className="button-icon" />
      case 'ok':
        return <OkIcon className="button-icon" />
      case 'no':
        return <NoIcon className="button-icon" />
      default:
        return false;
    }
  }

  render() {
    return (
      <div className="button"
        style={{ display: this.props.hidden ? 'none' : 'block' }}
        onClick={() => this.props.onClick()}>
        {this.getIcon()}
        <a href="javascript:void(0)">
          {this.props.title}
        </a>
      </div>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string
};

export default Button;
