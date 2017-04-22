import React from 'react';
import Button from './button.js';
import DropDown from './drop-down.js';
import File from './file.js';
import Folder from './folder.js';

function spliceContentItem(content, index) {
  const [i, ...ii] = index.split('.');

  if (ii.length && content[Number(i)].children) {
    return spliceContentItem(content[Number(i)].children, ii.join('.'));
  } else {
    return content.splice(Number(i), 1, { type: 'blank' })[0];
  }
}

function pushContentItem(content, index, item) {
  const [i, ...ii] = index.split('.');
  if (ii.length && content[Number(i)].children) {
    return pushContentItem(content[Number(i)].children, ii.join('.'), item);
  } else {
    content[Number(i)].children.push(item);
  }
}

function trimContent(content) {
  for (let i = 0; i < content.length; ++i) {
    if (content[i].children) {
      trimContent(content[i].children);
    }

    while (content[i] && content[i].type === 'blank') {
      content.splice(i, 1);
    }
  }
}

function indexIn(sourceIndex, targetIndex) {
  if (Object.is(targetIndex, null)) {
    return sourceIndex.split('.').length <= 1;
  }

  return sourceIndex.split('.').slice(0, -1).join('.') === targetIndex;
}

class Pane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: props.initialContent,
      create: false,
      createType: 'file',
      createName: '',
      selected: null
    };
  }

  createItem() {
    const item = {
      type: this.state.createType,
      name: this.state.createName
    };

    if (item.type === 'folder') {
      item.children = [];
    }

    const content = JSON.parse(JSON.stringify(this.state.content));

    if (Object.is(this.state.selected, null)) {
      content.push(item);
    } else {
      pushContentItem(content, this.state.selected, item);
    }

    this.setState({ content, create: false, createName: '' });
  }

  componentWillReceiveProps(nextProps) {
    const { helper } = nextProps;
    const { index } = this.props;

    if (helper) {
      const {
        source,
        paneIndex: sourcePaneIndex
      } = helper;

      helper.wait()
      .then(([_, { paneIndex, targetIndex }]) => {
        if (paneIndex !== sourcePaneIndex || !indexIn(source.index, targetIndex)) {
          const content = JSON.parse(JSON.stringify(this.state.content));

          if (index === sourcePaneIndex) {
            spliceContentItem(content, source.index);
          }

          if (index === paneIndex) {
            if (Object.is(targetIndex, null)) {
              content.push(source.item);
            } else {
              pushContentItem(content, targetIndex, source.item);
            }
          }

          trimContent(content);
          this.setState({ content });
        }
      }).catch(e => console.error(e.stack));
    }
  }

  onDrop() {
    this.props.onDrop(null);
  }

  renderChild(item, key) {
    switch(item.type) {
      case 'file':
        return (
          <File {...item}
            key={key}
            index={`${key}`}
            dragEnd={this.props.dragEnd}
            dragStart={this.props.dragStart}
            monitor={this.props.monitor} />
        );
      case 'folder':
        return (
          <Folder {...item}
            key={key}
            selected={this.state.selected}
            onSelect={(index) => this.onSelect(index)}
            index={`${key}`}
            dragEnd={this.props.dragEnd}
            dragStart={this.props.dragStart}
            onDrop={this.props.onDrop}
            monitor={this.props.monitor} />
        );
      default:
        throw new Error(`wrong type ${item.type}`);
    }
  }

  onSelect(index) {
    this.setState({ selected: index });
  }

  render() {
    return (
      <div className="pane"
        onMouseUp={() => this.onDrop()} >
        <div className="pane-controls">
          <Button title="Создать"
            type="add"
            hidden={this.state.create}
            onClick={(e) => {
              this.setState({ create: true })
            }} />
          <DropDown title="Создать"
            visible={this.state.create}>
            <p>
              <select value={this.state.createType}
                onChange={({ target }) => this.setState({ createType: target.value })}>
                <option value="file">Файл</option>
                <option value="folder">Папка</option>
              </select>
            </p>
            <p>
              <input type="text"
                value={this.state.createName}
                onChange={({ target }) => this.setState({ createName: target.value })}
                placeholder="Имя" />
            </p>
            <Button title="OK"
              onClick={() => this.createItem()}
              type="ok" />
            <Button title="Отмена"
              onClick={() => this.setState({ create: false })}
              type="no" />
          </DropDown>
        </div>
        {this.state.content.map((item, i) =>
          this.renderChild(item, i)
        )}
      </div>
    );
  }
}

export default Pane;
