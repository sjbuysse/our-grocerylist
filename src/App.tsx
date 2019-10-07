import React, { Component } from 'react';
import HeaderContainer from './components/Header/HeaderContainer';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actions from 'statemanagement/actions/data/data.actions';
import { UserData } from './model/user-data.interface';
import { AuthMetaData } from './model/auth-meta-data.interface';
import { Dispatch } from 'redux';
import * as AuthService from 'services/AuthService';
import * as UserService from 'services/UserService';
import { StoreState } from './model/store-state.interface';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from "util";
import { filter, merge, shareReplay, switchMap, tap } from 'rxjs/operators';
import Spinner from './components/Spinner/Spinner';
import LoginContainer from './components/Login/LoginContainer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import InviteContainer from './components/InviteContainer/InviteContainer';
import GroceryContainer from './components/Grocery/GroceryContainer';
import UserSettingsContainer from './components/UserSettings/UserSettingsContainer';

interface AppState {
    loading: boolean,
}

type AppProps = RouteComponentProps<any> & {
    isAuthenticated: boolean,
    user: UserData | undefined,
    setAuthMetaData: (authMetaData: AuthMetaData | undefined) => void
    setUserData: (userData: UserData | undefined) => void
    authData: AuthMetaData | undefined
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
            tap(authMetaData => this.props.setAuthMetaData(authMetaData!)),
            switchMap((authMetaData: AuthMetaData) => UserService.getUserData$(authMetaData.uid)),
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
                    <p>Icon made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></p>
                    <p>licensed by <a href="http://creativecommons.org/licenses/by/3.0/"
                                      title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></p>
                </footer>
            </div>
        );
    }
}

export function mapStateToProps({data}: StoreState) {
    return {
        user: data.user,
        isAuthenticated: !!data.authMetaData,
        authData: data.authMetaData
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.DataActions>) {
    return {
        setAuthMetaData: (authMetaData: AuthMetaData | undefined) => dispatch(actions.setAuthMetaData(authMetaData)),
        setUserData: (userData: UserData | undefined) => dispatch(actions.setUser(userData)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
