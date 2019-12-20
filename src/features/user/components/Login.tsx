import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import AnonymousLoginButton from './AnonymousLoginButton';

interface LoginProps {
    isAuthenticated?: boolean
}

class Login extends Component<LoginProps> {
    authWithFacebook = () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then((userCredential: firebase.auth.UserCredential) => {
        }).catch(e => console.log(e));
    }

    authWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then((userCredential: firebase.auth.UserCredential) => {
            console.log(userCredential.user);
        }).catch(e => console.log(e));
    }

    signInAnonymously = () => {
        firebase.auth().signInAnonymously().then((userCredential: firebase.auth.UserCredential) => console.log(userCredential.user));
    }

    render() {
        return (
            <div>
                <p className="sign-in-text">Please sign-in:</p>
                <FacebookLoginButton onClick={this.authWithFacebook}/>
                <GoogleLoginButton onClick={this.authWithGoogle}/>
                <AnonymousLoginButton onClick={this.signInAnonymously}/>
            </div>
        )
    }
}

export default Login;
