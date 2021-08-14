# eCommerce Platform 04 - Redux for State Management


### Redux Overview

{{< figure src="/images/eShop/redux-pattern.jpg">}}

- https://redux.js.org/understanding/thinking-in-redux/glossary

Redux is a predictable state container for JavaScript apps.

- It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.

Install `Redux DevTools` in chrome web store

```Bash
frontend % npm i redux react-redux redux-thunk redux-devtools-extension
```

- React-Redux is the official React UI bindings layer for Redux. It lets your React components read data from a Redux store, and dispatch actions to the store to update state.
- Redux Thunk middleware allows you to write `action creators` that return a `function` instead of an `action`. The thunk can be used to `delay the dispatch` of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods dispatch and getState as parameters.
  - With a plain basic Redux store, you can only do simple synchronous updates by dispatching an action. Middleware extends the store's abilities, and lets you write `async logic` that interacts with the store.

### Create a Redux Store

Create frontend/src/store.js

- `createStore(reducer, [preloadedState], [enhancer])`: Creates a Redux store that holds the complete state tree of your app. There should only be a single store in your app.

  - `reducer (Function)`: A `reducing function` that returns the next `state tree`, given the current state tree and an action to handle.
    - A `reducer` is a function that accepts an accumulation and a value and returns a new accumulation. They are used to **reduce a collection of values down to a single value**.
  - `[preloadedState] (any)`: The `initial state`. You may optionally specify it to hydrate the state from the server in universal apps, or to restore a previously serialized user session.
    - If you produced reducer with `combineReducers`, this must be a `plain object` with the same shape as the keys passed to it. Otherwise, you are free to pass anything that your reducer can understand.
  - `[enhancer] (Function)`: The store enhancer. You may optionally specify it to enhance the store with third-party capabilities such as middleware, time travel, persistence, etc.
    - The only store enhancer that ships with Redux is `applyMiddleware()`.

- `combineReducers`: turns an object whose values are different reducing functions into a single reducing function you can pass to `createStore`.

```js
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
```

In index.js

- The `<Provider>` component makes the Redux store available to any nested components that need to access the Redux store.
  - most applications will render a `<Provider>` at the top level, with the entire app’s component tree inside of it.
  - to replace `<React.StrictMode>`

```js
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

