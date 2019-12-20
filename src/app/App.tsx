import React, { Component } from 'react';
import HeaderContainer from '../core/components/Header/HeaderContainer';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
    actions as userActions, model as userModel,
    selectors as userSelectors,
    LoginContainer,
    UserSettingsContainer
} from 'features/user';
import { Dispatch } from 'redux';
import * as AuthService from 'services/AuthService';
import * as UserService from 'services/UserService';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from "util";
import { filter, map, merge, shareReplay, switchMap, tap } from 'rxjs/operators';
import Spinner from '../core/components/Spinner/Spinner';
import PrivateRoute from '../features/user/components/PrivateRoute';
import InviteContainer from '../core/components/InviteContainer/InviteContainer';
import GroceryContainer from '../features/grocery-list/components/GroceryContainer';

interface AppState {
    loading: boolean,
}

type AppProps = RouteComponentProps<any> & {
    isAuthenticated: boolean,
    user: userModel.UserData | undefined,
    setAuthMetaData: (authMetaData: userModel.AuthMetaData | undefined) => void
    setUserData: (userData: userModel.UserData | undefined) => void
    authData: userModel.AuthMetaData | undefined
}

class App extends Component<AppProps, AppState> {
    state: AppState = {
        loading: true,
    };

    private subscriptions: Subscription[] = [];

    componentDidMount() {
        const authMetaData$ = AuthService.getAuthMetaData().pipe(shareReplay(1));
        const userLoggedIn$ = authMetaData$.pipe(
            filter((authMetaData => !isNullOrUndefined(authMetaData))),
            map(val => ({
                displayName: val.displayName,
                email: val.email,
                photoURL: val.photoURL,
                uid: val.uid
            })),
            tap(authMetaData => this.props.setAuthMetaData(authMetaData!)),
            switchMap((authMetaData: userModel.AuthMetaData) => UserService.getUserData$(authMetaData.uid)),
            tap(this.props.setUserData),
        );
        const noUserLoggedIn$ = authMetaData$.pipe(
            filter((authMetaData => isNullOrUndefined(authMetaData))),
            //@ts-ignore
            tap(() => this.props.setAuthMetaData(undefined)),
            tap(this.props.setUserData),
        );
        userLoggedIn$.pipe(merge(noUserLoggedIn$))
            .subscribe(() => this.setState({loading: false}));
    }

    componentWillUnmount() {
        this.subscriptions.filter(s => !s.closed).forEach(s => s.unsubscribe());
    }

    render() {
        return (
            <div>
                {this.state.loading ? (<Spinner/>) :
                    (<div className="groceryapp">
                        <HeaderContainer/>
                        <Switch>
                            <PrivateRoute path='/invite' isAuthenticated={this.props.isAuthenticated}
                                          component={InviteContainer}/>
                            <PrivateRoute isAuthenticated={this.props.isAuthenticated} exact={true} path='/'
                                          component={GroceryContainer}/>
                            <PrivateRoute isAuthenticated={this.props.isAuthenticated} exact={true} path='/user'
                                          component={UserSettingsContainer}/>
                            <Route path="/login"
                                   render={() => <LoginContainer isAuthenticated={this.props.isAuthenticated}/>}/>
                        </Switch>
                    </div>)
                }
                <footer className="info">
                    <p>Icon made by <a href="https://www.flaticon.com/authors/smashicons"
                                       title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"
                                                                                 title="Flaticon">www.flaticon.com</a>
                    </p>
                    <p>licensed by <a href="http://creativecommons.org/licenses/by/3.0/"
                                      title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></p>
                </footer>
            </div>
        );
    }
}

export function mapStateToProps(rootState: any) {
    return {
        user: userSelectors.getUser(rootState),
        isAuthenticated: !!userSelectors.getAuthMetaData(rootState),
        authData: userSelectors.getAuthMetaData(rootState)
    }
}

export function mapDispatchToProps(dispatch: Dispatch<userActions.Actions>) {
    return {
        setAuthMetaData: (authMetaData: userModel.AuthMetaData | undefined) => dispatch(userActions.setAuthMetaData(authMetaData)),
        setUserData: (userData: userModel.UserData | undefined) => dispatch(userActions.setUser(userData)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
