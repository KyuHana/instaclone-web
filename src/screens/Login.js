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

const FacebookLogin = styled.div`
  color:#40588A;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

function Login() {
  const { register, watch } = useForm();
  console.log(watch);
  return (
    <AuthLayout>    
      <PageTitle title="Login"/>
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <form>
          <Input ref={register} name="username" type="text" placeholder="Username" />
          <Input ref={register} name="password" type="password" placeholder="Password" />
          <Button type="submit" value="Log in" placeholder="Log in" />
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