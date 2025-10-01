import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Component/Login';
import { useEffect, useState } from 'react';
import Sidebar from './Component/Sidebar';
import Counter from './Pages/HomePage/Counter';
import Testimonial from './Pages/HomePage/Testimonial';
import Certificates from './Pages/HomePage/Certificates';
import Faq from './Pages/AboutPage/Faq';
import ProductAdminToggle from './Pages/ProductPage/ProductAdminToggle';
import HomeAbout from './Pages/HomePage/HomeAbout';
import Vimalaboutus from './Pages/AboutPage/Vimalaboutus';
import Leaderlog from './Pages/AboutPage/Leaderlog';
import Ourstory from './Pages/AboutPage/Ourstory';
import HomeBanner from './Pages/HomePage/HomeBanner';
import AboutBanner from './Pages/AboutPage/AboutBanner';
import ProductBanner from './Pages/ProductPage/ProductBanner';
import BlogBanner from './Pages/BlogPage/BlogBanner';
import ExtraSubProduct from './Pages/ProductPage/ExtraSubProduct';
import BlogForm from './Pages/BlogPage/BlogForm';
import Principles from './Pages/AboutPage/Principles';
import OurCategory from './Pages/HomePage/OurCategory';

function App() {

  const [login, setlogin] = useState(false);

  useEffect(() => {
    setlogin((localStorage.getItem("login")))
  }, [login])

  return (
    <>
      <BrowserRouter>
        <div className="main_form d-flex">
          {
            login ?
              <>
                <Sidebar />
                <div className="main-content p-2 p-lg-4 mt-5 mt-lg-0 mt-md-0 flex-grow-1">
                  <Routes>
                    <Route path='/' element={<HomeBanner setlogin={setlogin} />} />
                    <Route path='/homebanner' element={<HomeBanner setlogin={setlogin} />} />
                    <Route path='/about' element={<HomeAbout />} />
                    <Route path='/counter' element={<Counter />} />
                    <Route path='/testimonial' element={<Testimonial />} />
                    <Route path='/certificate' element={<Certificates />} />
                    <Route path='/faq' element={<Faq />} />
                    <Route path='/productAdminToggle' element={<ProductAdminToggle />} />
                    <Route path='/extrasubproduct' element={<ExtraSubProduct />} />
                    <Route path='/vimalaboutus' element={<Vimalaboutus />} />
                    <Route path='/leaderlogo' element={<Leaderlog />} />
                    <Route path='/ourstory' element={<Ourstory />} />
                    <Route path='/aboutbanner' element={<AboutBanner />} />
                    <Route path='/productbanner' element={<ProductBanner />} />
                    <Route path='/ourcategory' element={<OurCategory />} />
                    <Route path='/blogbanner' element={<BlogBanner />} />
                    <Route path='/blog' element={<BlogForm />} />
                    <Route path='/principles' element={<Principles />} />
                  </Routes>
                </div>
              </>
              :
              <>
                <div className="main_login flex-grow-1">
                  <Routes>
                    <Route path='/' element={<Login setlogin={setlogin} />} />
                    <Route path='*' element={<Login setlogin={setlogin} />} />
                  </Routes>
                </div>
              </>
          }
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;