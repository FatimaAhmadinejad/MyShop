import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "./compontent/Header";
import Footer from "./compontent/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const App = () => {
  const initialOptions = {
    "client-id": "test", // مقدار اولیه؛ مقدار واقعی در OrderScreen تنظیم می‌شود
    currency: "USD",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </PayPalScriptProvider>
  );
};

export default App;