import * as ReactDOM from 'react-dom';
import { Layout } from "./layout";
import { Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

export function createLayoutService(store: Store, root: HTMLElement) {
  ReactDOM.render(
    <Provider store={store}>
      <Layout />
    </Provider>,
    root
  );
}