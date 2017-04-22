import React from 'react';
import Helper from '../lib/helper.js';
import DragBetween from './drag-between.js';
import Pane from './pane.js';

const leftPane = [{
  "type": "folder",
  "name": "folder 1",
  "children": [{
    "type": "file",
    "name": "file 1"
  }]
}, {
  "type": "folder",
  "name": "folder 2",
  "children": []
}];

const rightPane = [{
  "type": "folder",
  "name": "folder 1",
  "children": [{
    "type": "file",
    "name": "file 1"
  }]
}, {
  "type": "folder",
  "name": "folder 2",
  "children": []
}];

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helper: null
    };
  }

  dragStart(paneIndex, source) {
    this.setState({ helper: new Helper({ paneIndex, source }) });
  }

  dragEnd(paneIndex) {
    const { helper } = this.state;

    if (helper.paneIndex === paneIndex) {
      helper._dragResolve();
    } else {
      helper._dragReject(new Error('wrong pane'));
    }
  }

  onDrop(paneIndex, targetIndex) {
    const { helper } = this.state;

    if (helper) {
      helper._dropResolve({ paneIndex, targetIndex });
    }
  }

  render() {
    return (
      <DragBetween>
        <Pane initialContent={leftPane}
          index={0}
          helper={this.state.helper}
          dragStart={(source) => this.dragStart(0, source)}
          dragEnd={(source) => this.dragEnd(0, source)}
          onDrop={(target) => this.onDrop(0, target)} />
        <Pane initialContent={rightPane}
          index={1}
          helper={this.state.helper}
          dragStart={(source) => this.dragStart(1, source)}
          dragEnd={(source) => this.dragEnd(1, source)}
          onDrop={(target) => this.onDrop(1, target)} />
      </DragBetween>
    );
  }
}

export default Root;
