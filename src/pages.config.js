import Homepage from './pages/Homepage';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';
import ResetPassword from './pages/ResetPassword';
import BookingSuccess from './pages/BookingSuccess';
import Layout from './Layout.jsx';


export const PAGES = {
    "Homepage": Homepage,
    "About": About,
    "Services": Services,
    "Contact": Contact,
    "Profile": Profile,
    "PaymentSuccess": PaymentSuccess,
    "PaymentCancelled": PaymentCancelled,
    "ResetPassword": ResetPassword,
    "BookingSuccess": BookingSuccess,
}

export const pagesConfig = {
    mainPage: "Homepage",
    Pages: PAGES,
    Layout: Layout,
};