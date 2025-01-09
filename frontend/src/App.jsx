import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './screens/Home.jsx';
import Login from './screens/Login.jsx';
import Signup from './screens/signup.jsx';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'  //npm i bootstrap-dark-5 boostrap
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { CartProvider } from './components/contextReducer.jsx';
import MyOrders from './screens/MyOrders.jsx';
import GoogleAuth from './screens/googleAuth.jsx';

function App() {

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} /> 
          <Route exact path="/myOrders" element={<MyOrders />} />
          <Route exact path='/googleauth' element={<GoogleAuth />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
