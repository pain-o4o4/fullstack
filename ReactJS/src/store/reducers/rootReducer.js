import { combineReducers } from 'redux';

import appReducer from './appReducer';
import adminReducer from './adminReducer';
import userReducer from './userReducer';
import registerReducer from './registerReducer';
import socketReducer from './socketReducer';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
    storage,
    stateReconciler: autoMergeLevel2
};

const userPersistConfig = {
    ...persistCommonConfig,
    key: 'user',
    whitelist: ['isLoggedIn', 'userInfo', 'email', 'isOtpStep', 'registrationSessionToken']
};

const appPersistConfig = {
    ...persistCommonConfig,
    key: 'app',
    whitelist: ['language']
};

const socketPersistConfig = {
    ...persistCommonConfig,
    key: 'socket',
    whitelist: ['notifications', 'onlineUsers']
};

const rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
    app: persistReducer(appPersistConfig, appReducer),
    admin: adminReducer,
    register: registerReducer,
    socket: persistReducer(socketPersistConfig, socketReducer)
});

export default rootReducer;
