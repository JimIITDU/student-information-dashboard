import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand">
        🎓 Access to Education
      </Link>
      <div className="navbar-links">
        <Link to="/">Students</Link>
      </div>
    </nav>
  );
}

export default Navbar;