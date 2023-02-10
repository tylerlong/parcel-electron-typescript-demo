import React from 'react';
import ReactDOM from 'react-dom';

import {useProxy} from '@tylerlong/use-proxy';
import {Component} from '@tylerlong/use-proxy/build/react';

import {Button} from 'antd-mobile';

class Store {
  count = 10;
  increase() {
    this.count += 1;
  }
  decrease() {
    this.count -= 1;
  }
}
const store = useProxy(new Store());

class App extends Component<{store: Store}> {
  render() {
    const store = this.props.store;
    return (
      <>
        <Button color="primary" fill="outline" onClick={() => store.decrease()}>
          -
        </Button>
        {store.count}
        <Button color="primary" fill="outline" onClick={() => store.increase()}>
          +
        </Button>
      </>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App store={store} />, container);
