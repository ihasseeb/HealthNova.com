import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Floating Navbar */}
      <Navbar />

      {/* MAIN CONTENT - Added pt-24 (Padding Top) to push content below floating navbar */}
      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
