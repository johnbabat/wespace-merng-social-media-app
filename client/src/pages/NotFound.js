import { Link } from 'react-router-dom';
import './NotFound.css'

function NotFound() {
    return (
        <div className="notFound">
            <div>
                <h2>404. That's an error</h2>
                <img
                    src="http://www.google.com/images/errors/robot.png"
                    alt="not found robot"
                />
                <p>The requested URL was not found on this server</p>
                <p>Are you lost? Go back to <Link to='/'>HOMEPAGE</Link></p>
            </div>

            
        </div>
    )
}

export default NotFound
