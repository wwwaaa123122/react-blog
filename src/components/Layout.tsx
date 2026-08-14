import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
