import React, { Component } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import Login from './Login';
import { History } from 'history';

type Props = RouteComponentProps<any> & {
    isAuthenticated?: boolean
}

interface LoginContainerState {
    from: History.LocationState
}

class LoginContainer extends Component<Props, LoginContainerState> {
    constructor(props: Props) {
        super(props);
        const {from} = this.props.location.state || {from: {pathname: "/"}};

        this.state = {
            from
        };
        if (from.pathname.indexOf('?redirectUrl') === -1) {
            this.props.history.push('login?redirectUrl=' + from.pathname + from.search)
        }
    }

    render() {
        const redirectUrl = new URLSearchParams(this.props.location.search).get('redirectUrl');
        const typedRedirectUrl: string = redirectUrl ? redirectUrl : '/';
        return (
            <div>
                {(this.state.from.pathname.indexOf('/invite') !== -1) &&
                <p className="sign-up-text">You've been invited to join a shared grocery list. Please login to start
                    collaborating.
                    If you choose to log in anonymously then the list will be linked to your browser and you will have
                    to
                    be invited again when you log out or when you clear your browser history.</p>
                }
                {!this.props.isAuthenticated
                    ? (<Login/>)
                    : <Redirect to={typedRedirectUrl}/>}
            </div>
        )
    }
}

export default withRouter(LoginContainer);
