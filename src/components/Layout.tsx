import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-7 pb-14">
        <div className="mx-auto w-full max-w-[880px] px-5">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
