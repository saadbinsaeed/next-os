import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { reducers, flashBannerReducers, loadingBarReducer } from 'bluerain-client-services';
import AppBarReduceres from '../redux/reducers/AppBar';
import launcherReducers from '../redux/reducers/launcher';

let reduxStore = null;

// Get the Redux DevTools extension and fallback to a no-op function
let devtools = f => f;
if (process.browser && window.__REDUX_DEVTOOLS_EXTENSION__) {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__();
}

function create(apollo, initialState = {}) {
  return createStore(
    combineReducers({ // Setup reducers
      flashBanner: flashBannerReducers,
      loadingBar: loadingBarReducer,
      launcher: launcherReducers,
      bluerain: reducers,
      appBar: AppBarReduceres,
      apollo: apollo.reducer(),
    }),
    initialState, // Hydrate the store with server-side data
    compose(
      applyMiddleware(thunk),
      applyMiddleware(apollo.middleware()), // Add additional middleware here
      devtools
    )
  );
}

export default function initRedux (apollo, initialState) {
  // Make sure to create a new store for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(apollo, initialState)
  }

  // Reuse store on the client-side
  if (!reduxStore) {
    reduxStore = create(apollo, initialState)
  }

  return reduxStore
}
