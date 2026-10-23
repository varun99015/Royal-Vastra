import { Link, useLocation } from 'react-router-dom';

export default function NavLink({ to, children, className = '', activeClassName = 'text-burgundy' }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${className} ${isActive ? activeClassName : ''} transition-colors`}
    >
      {children}
    </Link>
  );
}
