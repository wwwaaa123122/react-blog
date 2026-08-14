import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { navLinks } from "../config/nav";
import { siteConfig } from "../config/site";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "./icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-logo">萤</span>
            <span>{siteConfig.title}</span>
          </Link>

          <nav>
            <ul className="nav-links">
              {navLinks.map((link) =>
                link.to ? (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive: act }) =>
                        `nav-link ${act ? "active" : ""}`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ) : (
                  <li key={link.name}>
                    <a
                      className="nav-link"
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {link.name}
                      <Icon name="external" size={13} />
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <button
              className="icon-btn hamburger"
              onClick={() => setOpen((o) => !o)}
              aria-label="菜单"
              aria-expanded={open}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                {open ? (
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                ) : (
                  <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${open ? "open" : ""}`}>
          <div className="mobile-menu-inner">
            {navLinks.map((link) =>
              link.to ? (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive: act }) =>
                    `nav-link ${act ? "active" : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </NavLink>
              ) : (
                <a
                  key={link.name}
                  className="nav-link"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {link.name}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
