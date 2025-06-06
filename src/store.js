import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { enhanceReduxMiddleware } from '@kepler.gl/reducers';
import keplerGlReducer from '@kepler.gl/reducers';

// Create a custom app reducer for managing application state
const initialAppState = {
  appName: 'Atlas Viewer',
  loaded: false,
  sidebarOpen: true
};

const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case 'INIT_APP':
      return {
        ...state,
        loaded: true
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    default:
      return state;
  }
};

// Combine reducers
const reducers = combineReducers({
  app: appReducer,
  keplerGl: keplerGlReducer
});

// Enhance middleware for Kepler.gl
const middlewares = enhanceReduxMiddleware([]);

// Create enhancers
const enhancers = [applyMiddleware(...middlewares)];

// Add Redux DevTools support
const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Create and export store
const store = createStore(reducers, {}, composeEnhancers(...enhancers));

export default store;
