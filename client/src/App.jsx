import './App.css'
import {Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import RegionalCourt from './components/regionalCourt/RegionalCourt';
import ApealCourt from './components/apealCourt/ApealCourt';
import DistrictCourt from './components/districtCourt/DistrictCourt';
import { Login } from './components/Login/Login';
import MyCase from './components/myCase/MyCase';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
 

  return (
    <div className="app-container">
          <Navbar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/district' element={<DistrictCourt />} />
              <Route path='/admin' element={<AdminDashboard />} />
              <Route path="/regional" element={<RegionalCourt />} />
              <Route path="/appeal" element={<ApealCourt />} />
              <Route path="/login" element={<Login />} />
              <Route path="/mycase/:id" element={<MyCase />} />
            </Routes>       
        </div>   
        <Footer />
    </div>
  )
}

export default App
