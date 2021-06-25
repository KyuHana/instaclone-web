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

const FacebookLogin = styled.div`
  color:#40588A;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

function Login() {
  const { register, watch, handleSubmit, errors, formState } = useForm({
    mode: "onChange",
  });
  const onSubmitValid = (data) => {
    console.log(data, "valid");
  };

  return (
    <AuthLayout>    
      <PageTitle title="Login"/>
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
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
          />
          <FormError message={errors?.password?.message} />
          <Button type="submit" value="Log in" placeholder="Log in" disabled={!formState.isValid} />
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