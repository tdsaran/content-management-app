import React, { useState, useContext } from 'react';
import jwt from 'jsonwebtoken';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { SERVICE_ROUTES } from '../../shared/routes'
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const setSwitchModeHandler = (mode) => {
    setIsLoginMode(prevMode => !mode);
    if (!mode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
  };

  const generateJwtToken = async (data) => {
    return jwt.sign(data, 'secret', { expiresIn: '1h' });
  }

  const authSubmitHandler = async event => {
    event.preventDefault();
    let token = '';

    if (isLoginMode) {
      try {
        token = await generateJwtToken({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          isAdmin: isAdminLogin
        });
        const responseData = await sendRequest(
          SERVICE_ROUTES.LOGIN,
          'POST',
          JSON.stringify({
            token
          }),
          {
            'Authorization': 'Basic ' + token,
            'Content-Type': 'application/json'
          }
        );
        
        localStorage.setItem('userToken', responseData.token);
        auth.login({
          userId: responseData.user.id, 
          isAdmin: isAdminLogin
        });
      } catch (err) { }
    } else {
      try {
        const request = {
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        };

        const responseData = await sendRequest(
          SERVICE_ROUTES.SIGNUP,
          'POST',
          JSON.stringify(request),
          {
            'Content-Type': 'application/json'
          }
        );

        localStorage.setItem('userToken', responseData.token);
        auth.login(responseData.user.id, isAdminLogin);
      } catch (err) { }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <nav>
          <ul className="auth-tabs">
            <li 
              className={ !isAdminLogin ? "active" : "" } 
              onClick={() => {
                setIsAdminLogin(false);
                setSwitchModeHandler(false);
              }}>
                USER LOGIN
            </li>
            <li 
              className={ isAdminLogin ? "active" : "" } 
              onClick={() => {
                setIsAdminLogin(true);
                setSwitchModeHandler(false);
              }
            }>
                ADMIN LOGIN
            </li>
          </ul>
        </nav>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={() => setSwitchModeHandler(isLoginMode)} disabled={isAdminLogin}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
