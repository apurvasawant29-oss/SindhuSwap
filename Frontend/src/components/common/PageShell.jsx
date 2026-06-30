import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

function PageShell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default PageShell;
