import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './modules/app/app';
import { middleware, reducer as routerReducer } from './modules/router';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: {
    router: routerReducer,
  },
  middleware: [middleware]
});

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>  
  </StrictMode>,
  document.getElementById('root')
);
