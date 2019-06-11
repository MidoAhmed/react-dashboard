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
import {Form} from 'antd';
import {Input} from 'antd';
import Notification from "../../components/notification";

const FormItem = Form.Item;

const {login} = authAction;

class SignIn extends Component {
    state = {
        credentials: {
            email: '',
            password: ''
        },
        redirectToReferrer: false,
        loading: false
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

    handleLogin = () => {
        const {login} = this.props;
        login(this.state.credentials);
    };

    toastLoginError = (_msg) => {
        message.error(<MessageContent>{_msg}</MessageContent>, 5);
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('err', err ,'values', values);
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


        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };

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

                            {/*<div className="isoInputWrapper">
                                <Input size="large"
                                       placeholder="Username"
                                       onChange={
                                           (_event) => this.setState({
                                               credentials: {
                                                   ...this.state.credentials,
                                                   email: _event.target.value
                                               }
                                           })
                                       }
                                />
                            </div>

                            <div className="isoInputWrapper">
                                <Input size="large"
                                       type="password"
                                       placeholder="Password"
                                       onChange={
                                           (_event) => this.setState({
                                               credentials: {
                                                   ...this.state.credentials,
                                                   password: _event.target.value
                                               }
                                           })
                                       }/>
                            </div>

                            <div className="isoInputWrapper isoLeftRightComponent">
                                <Checkbox>
                                    <IntlMessages id="page.signInRememberMe"/>
                                </Checkbox>
                                <Button type="primary"
                                        onClick={this.handleLogin}
                                        loading={this.props.loading}>
                                    <IntlMessages id="page.signInButton"/>
                                </Button>
                            </div>*/}

                            <Form onSubmit={this.handleSubmit}>
                                <FormItem {...formItemLayout} label="Username" hasFeedback>
                                    {getFieldDecorator('username', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input your Username!',
                                            },
                                        ],
                                    })(<Input name="username" id="username" onChange={
                                        (_event) => this.setState({
                                            credentials: {
                                                ...this.state.credentials,
                                                email: _event.target.value
                                            }
                                        })
                                    }/>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Password" hasFeedback>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            }
                                        ],
                                    })(<Input type="password" onChange={
                                        (_event) => this.setState({
                                            credentials: {
                                                ...this.state.credentials,
                                                password: _event.target.value
                                            }
                                        })
                                    }/>)}
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                    <Button type="primary"
                                            htmlType="submit"
                                            loading={this.props.loading}>
                                        <IntlMessages id="page.signInButton"/>
                                    </Button>
                                </FormItem>
                            </Form>

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
)(Form.create()(SignIn));
