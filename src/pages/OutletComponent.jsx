import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

function OutletComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default OutletComponent;
