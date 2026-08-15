import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const loc = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, [loc.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[900px] px-5 py-8 md:py-10">
          <div
            key={key}
            style={{
              animation: "slideDown 0.35s ease-out both",
            }}
          >
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
