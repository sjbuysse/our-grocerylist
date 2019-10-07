import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router';

// ...rest has properties like exact={true} and the path
const PrivateRoute = ({component, isAuthenticated, authenticationPath = '/login', ...rest}: any) => {
    console.log(rest);
    const routeComponent = (props: RouteComponentProps<any>) => (
        isAuthenticated
            ? React.createElement(component)
            : <Redirect to={{
                pathname: authenticationPath,
                state: {from: props.location}
            }}/>
    );
    return <Route {...rest} render={(props: RouteComponentProps<any>) => routeComponent(props)}/>;
};

export default PrivateRoute;