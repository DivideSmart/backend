import React, { Component, StyleSheet } from 'react';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import client_ids from './client_ids.json';
import { WhiteSpace } from 'antd-mobile'

class LoginPage extends Component {

    constructor(props) {
        super();
        this.state = { isAuthenticated: false, user: null, token: ''};
    }

    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null})
    };

    facebookResponse = (response) => {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        // response.setHeader('x-auth-token', response.accessToken);
        this.setState({isAuthenticated: true, user, token})
    };

    googleResponse = (response) => {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:8000/api/v1/auth/google', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    this.setState({isAuthenticated: true, user, token})
                }
            });
        })
    };

    onFailure = (error) => {
      alert(error);
    }

    render() {
        let facebook = 
            (
                <div>
                    <FacebookLogin
                        appId={client_ids.FCLIENT_ID}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.facebookResponse} 
                    />
                </div>
            )
        let google = 
            (
                <div>
                    <GoogleLogin
                        clientId={client_ids.GCLIENT_ID}
                        buttonText="Google Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />
                </div>
            );
        return (
            !!this.state.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            <div className="LoginPage" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                {facebook}
                <WhiteSpace />
                {google}
            </div>
        );
    }
}

export {LoginPage};