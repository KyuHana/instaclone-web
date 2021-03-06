import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { isLoggedInVar, darkModeVar, client } from './apollo';
import routes from './routes';
import Layout from './components/Layout';
import Home from './screens/Home';
import Login from './screens/Login';
import NotFound from './screens/NotFound';
import SignUp from './screens/SignUp';
import { darkTheme, GlobalStyles, lightTheme } from './styles';
import Profile from './screens/Profile';


function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>    
      <HelmetProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Router>
          <Switch>
            <Route exact path={routes.home}>
              {isLoggedIn ? (
                <Layout>
                  <Home />
                </Layout>
              ) : (<Login />)}
            </Route>
            {
              !isLoggedIn ? 
              <Route path={routes.signUp}><SignUp /></Route> :
              null
            }
            <Route path={`/users/:username`}>
              <Layout>
                <Profile />
              </Layout>
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
    </ApolloProvider>
  )
}

export default App;
