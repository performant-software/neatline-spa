import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers';
import rootSaga from './sagas'



const initialState = {};
const enhancers = [];
const middleware = [
  thunk
];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const sagaMiddleware = createSagaMiddleware();
const composedEnhancers = compose(
  applyMiddleware(...middleware),
  applyMiddleware(sagaMiddleware),
  ...enhancers
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

sagaMiddleware.run(rootSaga);
export default store;
