import {useState} from 'react';
import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import AuthLayout from '../components/auth/AuthLayout';
import Separator from '../components/auth/Separator';
import Button from '../components/auth/Button';
import Input from '../components/auth/Input';
import FormBox from '../components/auth/FormBox';
import BottomBox from '../components/auth/BottomBox';
import routes from '../routes';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import FormError from '../components/auth/FormError';
import { gql, useMutation } from '@apollo/client';
import { logUserIn } from '../apollo';
import { useLocation } from 'react-router-dom';

const FacebookLogin = styled.div`
  color:#40588A;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Notification = styled.div`
  color: #2ecc71; 
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username:$username, password:$password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const location = useLocation();
  const { register, handleSubmit, errors, formState, getValues, setError, clearErrors } = useForm({
    mode: "onChange",
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || ""
    }
  });
  const [login, {loading}] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const {login: {ok, error, token}} = data;
      if(!ok) {
        return setError("result", {
          message: error,
        })
      }
      if(token) {
        logUserIn(token)
      }
    }
  });
  const onSubmitValid = (data) => {
    if(loading) {
      return;
    }
    const {username, password} = getValues();
    login({
      variables: {
        username, password
      }
    })
  };
  const clearLoginError = () => {
    clearErrors("result");
  }
  return (
    <AuthLayout>    
      <PageTitle title="Login"/>
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{location?.state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input 
            ref={
              register({
              required: "Username is required", 
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars"
              },
            })}
            onChange={clearLoginError}
            name="username" 
            type="text"
            placeholder="Username" 
            hasError={Boolean(errors?.username?.message)}
          />
          <FormError message={errors?.username?.message} />
          <Input
            ref={register({required: "Password is required"})} 
            name="password" 
            type="password"
            placeholder="Password" 
            hasError={Boolean(errors?.password?.message)}
            onChange={clearLoginError}
          />
          <FormError message={errors?.password?.message} />
          <Button type="submit" value={loading ? "Loading..." : "Log in"} placeholder="Log in" disabled={!formState.isValid || loading } />
          <FormError message={errors?.result?.message} />
        </form>  
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare}/>
          <span>Login with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox cta="Don't have an account?Sign up" linkText="Sign up" link={routes.signUp}/>
    </AuthLayout>
  );
}
export default Login;