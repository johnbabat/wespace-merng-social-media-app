import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Image, Menu } from 'semantic-ui-react'
import { AuthContext } from '../context/authContext'

function MenuBar({activeItem, setActiveItem}) {
    
    const handleItemClick = (e, { name }) => setActiveItem(name)
    const { user, logout } = useContext(AuthContext)

    const MenuBar = !user ? (
      
      <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to='/'
          />
          <Menu.Menu position='right'>
            <Menu.Item
                name='login'
                active={activeItem === 'login'}
                onClick={handleItemClick}
                as={Link}
                to='/login'
            />
            <Menu.Item
              name='register'
              active={activeItem === 'register'}
              onClick={handleItemClick}
              as={Link}
              to='/register'
            />
          </Menu.Menu>
        </Menu>

    ) : (

      <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to='/'
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='user'
              as={Link}
              to={`/user/${user.id}`}
              active={activeItem === 'user'}
              onClick={handleItemClick}
            >
              <Image style={{width: '17.593px', height:'17.593px'}} src='https://react.semantic-ui.com/images/avatar/large/molly.png' avatar />
              <span style={{lineHeight: '17.593px'}} >{user.username}</span>
            </Menu.Item>

            <Menu.Item
              style={{marginLeft: '5px'}}
              name='logout'
              onClick={logout}
            />
          </Menu.Menu>
        </Menu>
    )

    return MenuBar;
}

export default MenuBar