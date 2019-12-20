import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './css/base.css';
import './css/grocery-list.css';
import './css/app.css';
import './core/components/Spinner/spinner.css';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { ErrorBoundary } from './core/components/ErrorBoundary/ErrorBoundary';
import store from './app/store';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ErrorBoundary>
                <App/>
            </ErrorBoundary>
        </BrowserRouter>
    </Provider>
    ,
    document.getElementById('root') as HTMLElement
);

serviceWorker.register();
