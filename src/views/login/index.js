import React, { useState } from 'react';
import { Container, Form, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { userLogin } from '../../actions';
import { connect } from 'react-redux';

const Login = (props) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const onSubmit = () => {
    props.userLogin({ email, password });
  };

  return (
    <Container
      text
    >
      <Header
        content='Neatline 3'
        style={{
          marginTop: '2em'
        }}
      />
      <Segment
        padded
        style={{
          marginTop: '1em'
        }}
      >
        { props.loginError && (
          <Message
            attached
            icon
            negative
            style={{
              marginBottom: '1em'
            }}
          >
            <Icon
              name='exclamation triangle'
            />
            <Message.Content>
              <Message.Header>Error</Message.Header>
              Incorrect email or password
            </Message.Content>
          </Message>
        )}
        <Form
          className='attached'
          onSubmit={onSubmit.bind(this)}
        >
          <Form.Input
            autoFocus
            icon='mail'
            iconPosition='left'
            label='Email'
            onChange={(e, { value }) => setEmail(value)}
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            label='Password'
            onChange={(e, { value }) => setPassword(value)}
            type='password'
          />
          <div
            style={{
              textAlign: 'right'
            }}
          >
            <Form.Button
              disabled={!(email && password) || props.login}
              primary
              type='submit'
            >
              Login
              <Icon
                className='right'
                loading={props.login}
                name={props.login ? 'spinner' : 'arrow alternate circle right outline'}
              />
            </Form.Button>
          </div>
        </Form>
      </Segment>
    </Container>
  );
};

const mapStateToProps = state => ({
  userSignedIn: state.user.userSignedIn,
  login: state.user.login,
  loginError: state.user.loginError
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
  dispatch
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
