import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Navbar, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import AllCourses from './AllCourses';
import bgImg from '../../assets/Images/bg.jpg';

const Home = () => {
   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary shadow-sm" sticky="top" style={{zIndex: 1000}}>
            <Container fluid>
               <Navbar.Brand>
                  <span style={{display:'flex', alignItems:'center', gap:'10px'}}>
                     <i className="bi bi-mortarboard-fill" style={{fontSize:'2rem', color:'#ffb300'}}></i>
                     <h2 style={{fontWeight:'bold', letterSpacing:'2px', margin:0}}>Learn App</h2>
                  </span>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav
                     className="me-auto my-2 my-lg-0"
                     style={{ maxHeight: '100px' }}
                     navbarScroll
                  >
                  </Nav>
                  <Nav>
                     <Link to={'/'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="custom-btn home-btn mx-1" variant="outline-dark" size="sm">Home</Button>
                        </motion.div>
                     </Link>
                     <Link to={'/login'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="custom-btn home-btn mx-1" variant="outline-dark" size="sm">Login</Button>
                        </motion.div>
                     </Link>
                     <Link to={'/register'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="custom-btn register-btn mx-1" variant="dark" size="sm">Register</Button>
                        </motion.div>
                     </Link>
                  </Nav>

               </Navbar.Collapse>
            </Container>
         </Navbar>

         {/* Hero Section */}
         <div id='home-container' className='first-container' style={{
            background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)), url(${bgImg}) center/cover no-repeat`,
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative',
         }}>
            <div className="content-home text-center" style={{zIndex:2}}>
               <h1 style={{fontWeight:'bold', fontSize:'2.8rem', letterSpacing:'1px'}}>Small App, Big Dreams</h1>
               <h4 className="mb-4" style={{fontWeight:400, color:'#ffe082'}}>Elevate Your Education Today</h4>
               <p style={{
                  fontSize: '1.25rem',
                  maxWidth: '600px',
                  margin: '0 auto',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  padding: '18px 28px',
                  color: '#fffde7',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                  fontStyle: 'italic',
                  letterSpacing: '0.5px',
                  borderLeft: '5px solid #ffb300',
                  marginBottom: '1.5rem',
               }}>
                  Join <span style={{color:'#ffe082', fontWeight:'bold'}}>thousands of learners</span> and <span style={{color:'#ffe082', fontWeight:'bold'}}>unlock your potential</span> with <span style={{color:'#ffe082', fontWeight:'bold'}}>trending courses</span>, <span style={{color:'#ffe082', fontWeight:'bold'}}>expert instructors</span>, and a <span style={{color:'#ffe082', fontWeight:'bold'}}>vibrant community</span>.
               </p>
               <Link to={'/register'}>
                  <motion.div
                     initial={{ y: 60, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                     style={{ display: 'inline-block' }}
                  >
                     <Button variant='warning' className='m-3 custom-btn explore-btn px-4 py-2' size='md' style={{fontWeight:'bold'}}>Explore Courses</Button>
                  </motion.div>
               </Link>
            </div>
         </div>

         {/* Features Section */}
         <style>{`
            .feature-card {
               transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s;
               cursor: pointer;
            }
            .feature-card:hover {
               transform: translateY(-12px) scale(1.04);
               box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
               z-index: 2;
            }
            .feature-card:hover .feature-icon {
               filter: brightness(1.2) drop-shadow(0 0 8px #ffe08288);
            }
         `}</style>
         <Container className="my-5">
            <Row className="g-4 text-center">
               <Col md={4}>
                  <Card className="h-100 shadow feature-card border-0">
                     <div className="feature-icon" style={{
                        background: 'linear-gradient(135deg, #fffde7 60%, #ffe082 100%)',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        marginTop: '-35px',
                        boxShadow: '0 4px 16px rgba(255,179,0,0.15)'
                     }}>
                        <span style={{fontSize:'2.5rem', color:'#ffb300'}}><i className="bi bi-lightbulb"></i></span>
                     </div>
                     <Card.Body>
                        <Card.Title className="mt-3 mb-2" style={{fontWeight:'bold', color:'#ffb300'}}>Expert Instructors</Card.Title>
                        <Card.Text style={{color:'#333', fontSize:'1.05rem'}}>Learn from industry professionals with real-world experience.</Card.Text>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={4}>
                  <Card className="h-100 shadow feature-card border-0">
                     <div className="feature-icon" style={{
                        background: 'linear-gradient(135deg, #e3f2fd 60%, #29b6f6 100%)',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        marginTop: '-35px',
                        boxShadow: '0 4px 16px rgba(41,182,246,0.15)'
                     }}>
                        <span style={{fontSize:'2.5rem', color:'#29b6f6'}}><i className="bi bi-laptop"></i></span>
                     </div>
                     <Card.Body>
                        <Card.Title className="mt-3 mb-2" style={{fontWeight:'bold', color:'#29b6f6'}}>Flexible Learning</Card.Title>
                        <Card.Text style={{color:'#333', fontSize:'1.05rem'}}>Access courses anytime, anywhere, and learn at your own pace.</Card.Text>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={4}>
                  <Card className="h-100 shadow feature-card border-0">
                     <div className="feature-icon" style={{
                        background: 'linear-gradient(135deg, #e8f5e9 60%, #66bb6a 100%)',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        marginTop: '-35px',
                        boxShadow: '0 4px 16px rgba(102,187,106,0.15)'
                     }}>
                        <span style={{fontSize:'2.5rem', color:'#66bb6a'}}><i className="bi bi-people"></i></span>
                     </div>
                     <Card.Body>
                        <Card.Title className="mt-3 mb-2" style={{fontWeight:'bold', color:'#66bb6a'}}>Community Support</Card.Title>
                        <Card.Text style={{color:'#333', fontSize:'1.05rem'}}>Join a vibrant community of learners and get help when you need it.</Card.Text>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>

         {/* Trending Courses Section */}
         <style>{`
            .trending-title {
               font-size: 2.2rem;
               font-weight: bold;
               letter-spacing: 1px;
               color: #222;
               text-shadow: 0 2px 12px #ffe08255;
               position: relative;
               display: inline-block;
            }
            .trending-title:after {
               content: '';
               display: block;
               width: 60px;
               height: 4px;
               background: linear-gradient(90deg, #ffb300 40%, #ffe082 100%);
               border-radius: 2px;
               margin: 12px auto 0 auto;
            }
            .trending-courses-box {
               background: linear-gradient(120deg, #fffde7 60%, #ffe082 100%);
               border-radius: 18px;
               box-shadow: 0 4px 32px rgba(255,179,0,0.08);
               padding: 32px 18px 24px 18px;
               margin-bottom: 2.5rem;
               margin-top: 1.5rem;
               min-height: 220px;
            }
         `}</style>
         <Container className="second-container">
            <h2 className="trending-title text-center my-4">Trending Courses</h2>
            <div className="trending-courses-box d-flex flex-column align-items-center justify-content-center">
               <AllCourses trendingOnly={true} emptyMessage={<div style={{textAlign:'center', color:'#888', fontWeight:'bold', fontSize:'1.2rem', padding:'30px 0'}}>No trending courses available at the moment.</div>} />
            </div>
         </Container>
      </>
   )
}

export default Home


