import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/auth/Button';
import Input from '../components/auth/Input';
import FormBox from '../components/auth/FormBox';
import BottomBox from '../components/auth/BottomBox';
import routes from '../routes';
import styled from 'styled-components';
import { FatLink } from '../components/shared';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import { gql, useMutation} from '@apollo/client';
import { useHistory } from 'react-router-dom';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`; 

const Subtitle = styled(FatLink)`  
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!,
    $lastName: String!,
    $username: String!,
    $email: String!,
    $password: String!
  ) {
    createAccount(
      firstName:$firstName,
      lastName:$lastName,
      username:$username,
      email:$email,
      password:$password
    ) {
      ok
      error
    }
  } 
`;

function SignUp() {
  const history = useHistory();
  const onCompleted = (data) => {
    const {username, password} = getValues();
    const {
      createAccount: { ok, error },
    } = data;
    if(!ok) {
      return;
    }
    history.push(routes.home, {message: "Account created. Please log in", username, password});
  }
  const [createAccount, {loading}] = useMutation(CREATE_ACCOUNT_MUTATION, {onCompleted});
  const {register, handleSubmit, errors, formState, getValues} = useForm({
    mode: "onChange",
  });
  const onSubmitValid = (data) => {
    if(loading) {
      return;
    }
    createAccount({
      variables: {
        ...data
      }
    })
  };
  return (
    <AuthLayout>
      <PageTitle title="Sign up"/>
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>Sign up to see photos and videos from your friends.</Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input ref={register({required: "First Name is required"})} type="text" placeholder="First Name" name="firstName" />
          <Input ref={register} type="text" placeholder="Last Name" name="lastName" />
          <Input ref={register({required: "Email is required"})} type="text" placeholder="Email" name="email" />  
          <Input ref={register({required: "Username is required"})} type="text" placeholder="Username" name="username" />
          <Input ref={register({required: "Password is required"})} type="password" placeholder="Password" name="password" />
          <Button 
            type="submit" 
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          />
        </form>  
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Log in" link={routes.home}/>
    </AuthLayout>
  );
}
export default SignUp;