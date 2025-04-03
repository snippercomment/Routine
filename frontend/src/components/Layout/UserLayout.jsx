import Header from "../Common/Header"
import Footer from "../Common/Footer"
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
    {/* header */}
      <Header />
    <main>
      <Outlet />
    </main>
      {/* footer */}
      <Footer />
    </div>
  );
}

export default UserLayout;
