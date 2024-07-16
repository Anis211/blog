/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="h-auto bg-[#404040] overflow-x-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
