import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './css/base.css';
import './css/grocery-list.css';
import './css/app.css';
import './components/Spinner/spinner.css';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from 'statemanagement/reducers/root.reducer';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';


/* eslint-disable no-underscore-dangle */
const store = createStore(
    rootReducer, /* preloadedState, */
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */

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
