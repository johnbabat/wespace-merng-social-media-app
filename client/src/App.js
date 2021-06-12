import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { useState } from 'react';

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { checkUser } from './utils/AuthRouter';

import MenuBar from './components/MenuBar'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import NotFound from './pages/NotFound';
import UserPage from './pages/UserPage';

function App() {

  const findPath = (path) => {
    if (!path.slice(1)) {
      return 'home'
    }
    if (path.slice(1, 5) === 'user') {
      return 'user'
    }
    return path.slice(1)
  }
  
  const [activeItem, setActiveItem] = useState(findPath(window.location.pathname))

  const user = checkUser()

  return (
      <Router>
          <Container>
            <MenuBar activeItem={activeItem} setActiveItem={setActiveItem} />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route
                  exact 
                  path='/login' 
                  render={(props) => (
                    user ? <Redirect to='/'/> : <Login {...props} setActiveItem={setActiveItem}/>
                  )}
                />
              <Route 
                  exact 
                  path='/register' 
                  render={(props) => (
                    user ? <Redirect to='/'/> : <Register {...props} setActiveItem={setActiveItem}/>
                  )}
                />
                <Route 
                  exact 
                  path='/user/:userId' 
                  render={(props) => (
                    <UserPage {...props} setActiveItem={setActiveItem}/>
                  )}
                />
              <Route exact path='/post/:postId' component = {SinglePost} />
              <Route exact component={NotFound} />
            </Switch>
          </Container>
      </Router>
  );
}

export default App;
