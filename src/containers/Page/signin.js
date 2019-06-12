import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import Auth0 from '../../helpers/auth0';
import Firebase from '../../helpers/firebase';
import FirebaseLogin from '../../components/firebase';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import message from "../../components/feedback/message";
import MessageContent from "../Feedback/Message/message.style";
import {Input} from 'antd';


const {login} = authAction;

class SignIn extends Component {
    state = {
        redirectToReferrer: false,
        loading: false,
        form: {
            username: {
                value: '',
                validation: {
                    required: {
                        value: true,
                        message: 'Please input your Username !'
                    },
                    minLength: {
                        value: 2,
                        message: 'Username minLength is 6 characters!'
                    },
                    maxLength: {
                        value: 10,
                        message: 'Username maxLength is 30 characters!'
                    }
                },
                errors: [],
                valid: false,
                touched: false
            },
            password: {
                value: '',
                validation: {
                    required: {
                        value: true,
                        message: 'Please input your Password !'
                    },
                    minLength: {
                        value: 2,
                        message: 'Password maxLength is 6 characters!'
                    },
                    maxLength: {
                        value: 10,
                        message: 'Password maxLength is 30 characters!'
                    }
                },
                errors: [],
                valid: false,
                touched: false
            }
        },
        formIsValid: false
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillReceiveProps(nextProps) {
        /*if (this.props.isLoggedIn !== nextProps.isLoggedIn && nextProps.isLoggedIn === true) {
            this.setState({redirectToReferrer: true});
        }*/

        if (nextProps.loginFailed !== this.props.loginFailed && nextProps.loginFailed !== null) {
            this.toastLoginError(nextProps.loginFailed);
        }
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedForm = {
            ...this.state.form
        };
        const updatedFormElement = {
            ...updatedForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement);
        updatedFormElement.touched = true;
        updatedForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({form: updatedForm, formIsValid: formIsValid});
    };

    checkValidity = (value, updatedFormElement) => {
        const rules = updatedFormElement.validation;
        delete updatedFormElement.errors;
        updatedFormElement.errors = [];
        let isValid = true;

        if (rules.required.value) {
            isValid = value.trim() !== '' && isValid;
            if (!(value.trim() !== ''))
                updatedFormElement.errors.push({key: 'required', message: rules.required.message});
        }

        if (rules.minLength.value) {
            isValid = value.length >= rules.minLength.value && isValid;
            if (!(value.length >= rules.minLength.value) && (value.trim() !== '')) {
                updatedFormElement.errors.push({key: 'minLength', message: rules.minLength.message});
            }
            else {
                let index = -1;
                updatedFormElement.errors.forEach(
                    (item, _index) => {
                        index = (item.key === 'minLength') ? _index : -1;
                    });
                if (index !== -1)
                    updatedFormElement.errors.splice(index, 1);
            }
        }

        if (rules.maxLength.value) {
            isValid = value.length <= rules.maxLength.value && isValid;
            if (!(value.length <= rules.maxLength.value))
                updatedFormElement.errors.push({key: 'maxLength', message: rules.maxLength.message});
            else {
                let index = -1;
                updatedFormElement.errors.forEach(
                    (item, _index) => {
                        index = (item.key === 'maxLength') ? _index : -1;
                    });
                if (index !== -1)
                    updatedFormElement.errors.splice(index, 1);
            }
        }

        return isValid;
    };

    handleLogin = () => {
        const {login} = this.props;
        login({email: this.state.form.username.value, password: this.state.form.password.value});
    };

    toastLoginError = (_msg) => {
        message.error(<MessageContent>{_msg}</MessageContent>, 5);
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('err', err, 'values', values);
            const {login} = this.props;
            login(this.state.credentials);
            /*if (!err) {
                Notification(
                    'success',
                    'Received values of form',
                    JSON.stringify(values)
                );
            }*/
        });
    };

    render() {
        const from = {pathname: '/dashboard'};
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from}/>;
        }


        return (
            <SignInStyleWrapper className="isoSignInPage">
                <div className="isoLoginContentWrapper">
                    <div className="isoLoginContent">
                        <div className="isoLogoWrapper">
                            <Link to="/dashboard">
                                <IntlMessages id="page.signInTitle"/>
                            </Link>
                        </div>

                        <div className="isoSignInForm">

                            <div className="isoInputWrapper">
                                <Input size="large"
                                       placeholder="Username"
                                       className={!this.state.form.username.valid && this.state.form.username.validation && this.state.form.username.touched ? 'invalid' : ''}
                                       onChange={(event) => this.inputChangeHandler(event, 'username')}
                                />
                                {
                                    (!this.state.form.username.valid && this.state.form.username.validation && this.state.form.username.touched) &&
                                    this.state.form.username.errors.map(
                                        (item, index) => <div className="input-explain" key={index}>
                                            <span>{item.message}</span>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="isoInputWrapper">
                                <Input size="large"
                                       type="password"
                                       placeholder="Password"
                                       className={!this.state.form.password.valid && this.state.form.password.validation && this.state.form.password.touched ? 'invalid' : ''}
                                       onChange={(event) => this.inputChangeHandler(event, 'password')}/>
                                {
                                    (!this.state.form.password.valid && this.state.form.password.validation && this.state.form.password.touched) &&
                                    this.state.form.password.errors.map(
                                        (item, index) => <div className="input-explain" key={index}>
                                            <span>{item.message}</span>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="isoInputWrapper isoLeftRightComponent">
                                <Checkbox>
                                    <IntlMessages id="page.signInRememberMe"/>
                                </Checkbox>
                                <Button type="primary"
                                        onClick={this.handleLogin}
                                        loading={this.props.loading}
                                        disabled={!this.state.formIsValid}>
                                    <IntlMessages id="page.signInButton"/>
                                </Button>
                            </div>

                            {/*<p className="isoHelperText">
                                <IntlMessages id="page.signInPreview"/>
                            </p>*/}

                            {/*<div className="isoInputWrapper isoOtherLogin">
                                <Button onClick={this.handleLogin} type="primary btnFacebook">
                                    <IntlMessages id="page.signInFacebook"/>
                                </Button>
                                <Button onClick={this.handleLogin} type="primary btnGooglePlus">
                                    <IntlMessages id="page.signInGooglePlus"/>
                                </Button>

                                {Auth0.isValid &&
                                <Button
                                    onClick={() => {
                                        Auth0.login(this.handleLogin);
                                    }}
                                    type="primary btnAuthZero"
                                >
                                    <IntlMessages id="page.signInAuth0"/>
                                </Button>}

                                {Firebase.isValid && <FirebaseLogin login={this.handleLogin}/>}
                            </div>*/}

                            <div className="isoCenterComponent isoHelperWrapper">
                                <Link to="/forgotpassword" className="isoForgotPass">
                                    <IntlMessages id="page.signInForgotPass"/>
                                </Link>
                                <Link to="/signup">
                                    <IntlMessages id="page.signInCreateAccount"/>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </SignInStyleWrapper>
        );
    }
}

export default connect(
    state => ({
        isLoggedIn: state.Auth.get('idToken') !== null,
        loading: state.Auth.get('loading'),
        loginFailed: state.Auth.get('loginFailed')
    }),
    {login}
)(SignIn);
