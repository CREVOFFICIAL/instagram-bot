import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from '../reducers';

const configureStore = preloadedState => {
    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        reducer,
        preloadedState,
        composeEnhancers(applyMiddleware(sagaMiddleware))
    );

    store.runSaga = sagaMiddleware.run;
    return store;
}

export default configureStore;