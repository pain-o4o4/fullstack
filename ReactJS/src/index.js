import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from './hoc/IntlProviderWrapper';
import SocketProvider from './context/SocketContext';

import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';
import { injectStore } from './auth/axiosInstance';
import { injectStoreForRefresh, restoreTimer } from './auth/TokenRefreshManager';

// Inject Redux store vào Axios (để interceptor truy cập state)
injectStore(reduxStore);

// Inject Redux store vào TokenRefreshManager (để silent refresh cập nhật state)
injectStoreForRefresh(reduxStore);

// Khôi phục timer refresh nếu user vẫn đang login từ phiên trước (F5/mở tab mới)
restoreTimer();
const renderApp = () => {
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
        <Provider store={reduxStore}>
            <IntlProviderWrapper>
                <SocketProvider>
                    <App persistor={persistor} />
                </SocketProvider>
            </IntlProviderWrapper>
        </Provider>
    );
};

renderApp();
serviceWorker.unregister();
