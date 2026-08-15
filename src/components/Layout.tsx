import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[900px] px-5 py-8 md:py-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
