import React from 'react';
import {createRoot} from 'react-dom/client';
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
        <Button onClick={async () => alert(await electronAPI.readFile())}>
          Read File
        </Button>
        <Button
          onClick={async () => alert(await electronAPI.method2('Hello world'))}
        >
          hello world
        </Button>
      </>
    );
  }
}

electronAPI.onMessage((event, message) => {
  console.log(message);
});

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App store={store} />);
