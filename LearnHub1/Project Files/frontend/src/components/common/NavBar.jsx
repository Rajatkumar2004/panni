import React, { useContext, useState } from 'react'
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { UserContext } from '../../App';
import { NavLink } from 'react-router-dom';

const NavBar = ({ setSelectedComponent }) => {
   const user = useContext(UserContext)
   const [showLogoutModal, setShowLogoutModal] = useState(false);

   if (!user) {
      return null
   }


   const handleLogout = () => {
      setShowLogoutModal(true);
   }
   const confirmLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
   }
   const handleOptionClick = (component) => {
      setSelectedComponent(component);
   };

   return (
      <>
      {showLogoutModal && (
         <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>
            <div style={{
               background: '#fff',
               color: '#222',
               fontWeight: 700,
               fontSize: '1.1rem',
               borderRadius: '18px',
               padding: '36px 44px',
               boxShadow: '0 8px 32px #00000022',
               minWidth: 340,
               textAlign: 'center',
               position: 'relative',
               border: '2px solid #ffe082',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
            }}>
               <span style={{fontSize: 32, marginBottom: 12, color:'#ff7e5f'}}><i className="bi bi-box-arrow-right"></i></span>
               <div style={{marginBottom: 18}}>Are you sure you want to log out?</div>
               <div style={{marginTop: 8, display: 'flex', justifyContent: 'center', gap: 18}}>
                  <Button variant="danger" style={{fontWeight:600, minWidth:90, borderRadius:8, boxShadow:'0 2px 8px #ffb30055', background:'#ff5252', border:'none'}} onClick={confirmLogout}>OK</Button>
                  <Button variant="outline-secondary" style={{fontWeight:600, minWidth:90, borderRadius:8}} onClick={()=>setShowLogoutModal(false)}>Cancel</Button>
               </div>
               <button onClick={() => setShowLogoutModal(false)} style={{
                  position: 'absolute',
                  top: 8,
                  right: 12,
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  color: '#ff5252',
                  cursor: 'pointer',
               }} aria-label="Close popup">
                  ×
               </button>
            </div>
         </div>
      )}
      <Navbar expand="lg" className="bg-body-tertiary shadow-sm" sticky="top" style={{zIndex: 1000}}>
         <style>{`
            .navbar-nav .nav-link, .navbar-nav a {
               font-weight: 600;
               color: #222 !important;
               margin-right: 18px;
               font-size: 1.08rem;
               letter-spacing: 0.5px;
               border-radius: 8px;
               padding: 8px 18px;
               transition: background 0.18s, color 0.18s, box-shadow 0.18s;
            }
            .navbar-nav .nav-link:hover, .navbar-nav a:hover {
               background: linear-gradient(90deg, #ffe082 0%, #29b6f6 100%);
               color: #222 !important;
               box-shadow: 0 2px 8px #29b6f633;
            }
            .custom-btn {
               background: linear-gradient(90deg, #66bb6a 0%, #b2ff59 100%);
               color: #222;
               font-weight: 700;
               border: none;
               border-radius: 8px;
               box-shadow: 0 2px 8px #66bb6a33;
               padding: 8px 22px;
               font-size: 1.08rem;
               letter-spacing: 0.5px;
               transition: background 0.2s, box-shadow 0.2s, color 0.2s;
            }
            .custom-btn:hover {
               background: linear-gradient(90deg, #ff5252 0%, #ffb300 100%);
               color: #fff;
               box-shadow: 0 4px 16px #ffb30055;
            }
         `}</style>
         <Container fluid>
            <Navbar.Brand>
               <h3>learn App</h3>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
               <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                  {/* <NavLink onClick={() => handleOptionClick('home')}>Home</NavLink>  */}
                  <a href="/dashboard">Home</a>
                  {user.userData.type === 'Teacher' && (
                     <NavLink onClick={() => handleOptionClick('addcourse')}>Add Course</NavLink>
                  )}
                  {user.userData.type === 'Admin' && (
                     <>
                        <NavLink onClick={() => handleOptionClick('cousres')}>Courses</NavLink>
                     </>
                  )}
                  {user.userData.type === 'Student' && (
                     <>
                        <NavLink onClick={() => handleOptionClick('enrolledcourese')}>Enrolled Courses</NavLink>
                     </>

                  )}
               </Nav>
               <Nav>
                  <h5 className='mx-3'>Hi {user.userData.name}</h5>
                  <Button onClick={handleLogout} size='sm' variant='outline-danger' className='custom-btn'>Log Out</Button >
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
      </>
   )
}

export default NavBar

