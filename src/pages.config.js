import About from './pages/About';
import BookingSuccess from './pages/BookingSuccess';
import Contact from './pages/Contact';
import DebugAuth from './pages/DebugAuth';
import Home from './pages/Home';
import Homepage from './pages/Homepage';
import PaymentCancelled from './pages/PaymentCancelled';
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import Services from './pages/Services';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "BookingSuccess": BookingSuccess,
    "Contact": Contact,
    "DebugAuth": DebugAuth,
    "Home": Home,
    "Homepage": Homepage,
    "PaymentCancelled": PaymentCancelled,
    "PaymentSuccess": PaymentSuccess,
    "Profile": Profile,
    "ResetPassword": ResetPassword,
    "Services": Services,
}

export const pagesConfig = {
    mainPage: "Homepage",
    Pages: PAGES,
    Layout: __Layout,
};