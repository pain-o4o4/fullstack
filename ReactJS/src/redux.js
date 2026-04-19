import { logger } from "redux-logger";
import thunkMiddleware from "redux-thunk";

import { createStore, applyMiddleware, compose } from 'redux';
import { createStateSyncMiddleware } from 'redux-state-sync';
import { persistStore } from 'redux-persist';

import rootReducer from './store/reducers/rootReducer';
import actionTypes from './store/actions/actionTypes';

const environment = process.env.NODE_ENV || "development";
let isDevelopment = environment === "development";

// tắt log redux
isDevelopment = false;
const reduxStateSyncConfig = {
    whitelist: [
        actionTypes.APP_START_UP_COMPLETE,
    ]
}



const middleware = [
    thunkMiddleware,
    createStateSyncMiddleware(reduxStateSyncConfig),
];

if (isDevelopment) middleware.push(logger);

const composeEnhancers =
    (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

const reduxStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware)),
);

export const dispatch = reduxStore.dispatch;
export const persistor = persistStore(reduxStore);

export default reduxStore;