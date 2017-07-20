/**
 * @author Muhammad Atif
 */
import React, { PropTypes } from 'react';
import { withNotifications } from '../Notifications/withNotifications';
import SignupComponent from './Signup.component';

class SignupContainer extends React.Component {

  static firstName(fullName) {
    if (fullName !== '' && fullName !== undefined) {
      return fullName.split(' ').slice(0, -1).join(' ');
    }
    return '';
  }
  static lastName(fullName) {
    if (fullName !== '' && fullName !== undefined) {
      return fullName.split(' ').slice(-1).join(' ');
    }
    return '';
  }
  constructor(props) {
    super(props);
    this.state = {
      message: 'Sign Up',
      disabled: false,
    };
    this.login = this.props.login;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(credentials) {
    const my = this;
    this.setState({'message':'Creating Your Account...','disabled': true});
    this.props.mutate({
      variables: {
        "data":{
          firstName: SignupContainer.firstName(credentials.fullName),
          lastName: SignupContainer.lastName(credentials.fullName),
          username: credentials.email.toLowerCase(),
          email: credentials.email.toLowerCase(),
          password: credentials.password,
          phoneNumber: credentials.phoneNumber,
          emailVerified: true
        }
      }
    })
    .then(({ data }) => {
      my.login({
        email: data.Account.AccountCreate.obj.email,
        password: credentials.password
      });
    })
    .catch((error) => {
      const { addNotification } = this.props.notification;
      addNotification({
        title: 'Oops',
        message: error.message,
        level: 'error',
        position: 'br'
      });
      this.setState({'message':'Failed! Retry','disabled': false});
    });
  }

  render() {
    return (
      <SignupComponent
        remember={false}
        message={this.state.message}
        disabled={this.state.disabled}
        onSubmit={credentials => this.handleSubmit(credentials)}
      />
    );
  }
}

SignupContainer.propTypes = {
  mutate: PropTypes.func.isRequired
};

export default withNotifications(SignupContainer);
