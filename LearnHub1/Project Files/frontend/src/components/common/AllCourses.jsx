import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import {
   MDBCol,
   MDBInput,
   MDBRow,
} from "mdb-react-ui-kit";

const AllCourses = ({ trendingOnly }) => {
   const navigate = useNavigate()
   const user = useContext(UserContext)
   const [allCourses, setAllCourses] = useState([]);
   const [filterTitle, setFilterTitle] = useState('');
   const [filterType, setFilterType] = useState('');

   const [showModal, setShowModal] = useState(Array(allCourses.length).fill(false));
   const [cardDetails, setCardDetails] = useState({
      cardholdername: '',
      cardnumber: '',
      cvvcode: '',
      expmonthyear: '',
   })

   const [showPopup, setShowPopup] = useState(false);
   const [popupMessage, setPopupMessage] = useState("");
   const [formErrors, setFormErrors] = useState({});

   // --- Backend enrolled courses state ---
   const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

   useEffect(() => {
      // Fetch enrolled courses for the logged-in student
      const fetchEnrolledCourses = async () => {
         try {
            const res = await axiosInstance.get('api/user/enrolledcourses', {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            });
            if (res.data.success && Array.isArray(res.data.data)) {
               setEnrolledCourseIds(res.data.data.map(c => c._id));
            }
         } catch (error) {
            // Ignore error, fallback to localStorage only
         }
      };
      if (user && user.userLoggedIn) fetchEnrolledCourses();
   }, [user]);

   const handleChange = (e) => {
      setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })
   }


   const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
      if (coursePrice == 'free') {
         handleSubmit(courseId)
         return navigate(`/courseSection/${courseId}/${courseTitle}`)
      } else {

         const updatedShowModal = [...showModal];
         updatedShowModal[courseIndex] = true;
         setShowModal(updatedShowModal);
      }
   };

   // Function to handle closing the modal for a specific course
   const handleClose = (courseIndex) => {
      const updatedShowModal = [...showModal];
      updatedShowModal[courseIndex] = false;
      setShowModal(updatedShowModal);
   };

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcourses`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
   }, []);

   const isPaidCourse = (course) => {
      // Check if C_price contains a number
      return /\d/.test(course.C_price);
   };

   // Utility to check if course is purchased or enrolled
   const isCoursePurchased = (courseId) => {
      const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
      // Check both localStorage and backend-enrolled courses
      return purchased.includes(courseId) || enrolledCourseIds.includes(courseId);
   };

   // Update purchased courses in localStorage after purchase
   const handleSubmit = async (courseId) => {
      try {
         const res = await axiosInstance.post(`api/user/enrolledcourse/${courseId}`, cardDetails, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            // Mark as purchased
            const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
            if (!purchased.includes(courseId)) {
               purchased.push(courseId);
               localStorage.setItem('purchasedCourses', JSON.stringify(purchased));
            }
            setPopupMessage('Successfully purchased!');
            setShowPopup(true);
            setShowModal(Array(allCourses.length).fill(false)); // Close all modals
            setTimeout(() => {
               setShowPopup(false);
               navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
            }, 2000);
         } else {
            setPopupMessage(res.data.message);
            setShowPopup(true);
            setTimeout(() => {
               setShowPopup(false);
               navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
            }, 2000);
         }
      } catch (error) {
         setPopupMessage('An error occurred. Please try again.');
         setShowPopup(true);
         setTimeout(() => setShowPopup(false), 2000);
      }
   }

   const validateCardDetails = () => {
      const errors = {};
      // Card Holder Name: only letters and spaces
      if (!/^[A-Za-z ]+$/.test(cardDetails.cardholdername.trim())) {
         errors.cardholdername = 'Name must contain only letters';
      }
      // Card Number: only numbers, exactly 16 digits
      if (!/^\d{16}$/.test(cardDetails.cardnumber)) {
         errors.cardnumber = 'Please enter a valid 16-digit card number';
      }
      // Expiration: MM/YYYY, month 01-12, year 4 digits
      if (!/^\d{2}\/\d{4}$/.test(cardDetails.expmonthyear)) {
         errors.expmonthyear = 'Format must be MM/YYYY';
      } else {
         const [mm, yyyy] = cardDetails.expmonthyear.split('/');
         if (parseInt(mm, 10) < 1 || parseInt(mm, 10) > 12) {
            errors.expmonthyear = 'Month must be between 01 and 12';
         }
         if (mm.length !== 2) {
            errors.expmonthyear = 'Month must be two digits (e.g., 01)';
         }
         if (yyyy.length !== 4) {
            errors.expmonthyear = 'Year must be four digits';
         }
      }
      // CVV: only 3 digits
      if (!/^\d{3}$/.test(cardDetails.cvvcode)) {
         errors.cvvcode = 'CVV must be 3 digits';
      }
      return errors;
   };

   const handleCardInput = (e) => {
      const { name, value } = e.target;
      let newValue = value;
      if (name === 'cardholdername') {
         newValue = newValue.replace(/[^A-Za-z ]/g, '');
      }
      if (name === 'cardnumber') {
         newValue = newValue.replace(/[^\d]/g, '').slice(0, 16);
      }
      if (name === 'cvvcode') {
         newValue = newValue.replace(/[^\d]/g, '').slice(0, 3);
      }
      if (name === 'expmonthyear') {
         let digits = newValue.replace(/[^\d]/g, '');
         if (digits.length === 1 && digits > '1') {
            // If user types 3-9 as first digit, auto-pad with 0
            digits = '0' + digits;
         }
         if (digits.length > 4) digits = digits.slice(0, 6);
         if (digits.length > 2) {
            let mm = digits.slice(0, 2);
            if (parseInt(mm, 10) > 12) mm = '12';
            newValue = mm + '/' + digits.slice(2, 6);
         } else {
            newValue = digits;
         }
      }
      setCardDetails({ ...cardDetails, [name]: newValue });
   };

   const handlePaymentSubmit = (e, courseId) => {
      e.preventDefault();
      const errors = validateCardDetails();
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) return;
      handleSubmit(courseId);
   };

   return (
      <>
         {/* Popup for course feedback */}
         {showPopup && (
            <div style={{
               position: 'fixed',
               top: 0, left: 0, right: 0, bottom: 0,
               background: 'rgba(0,0,0,0.18)',
               zIndex: 9999,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}>
               <div style={{
                  background: 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)',
                  color: '#222',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: '16px',
                  padding: '28px 36px',
                  boxShadow: '0 4px 24px #ffe08299',
                  minWidth: 280,
                  textAlign: 'center',
                  position: 'relative',
               }}>
                  <span style={{fontSize: 22, marginRight: 8, color: '#ff5252'}}><i className="bi bi-x-octagon-fill"></i></span>
                  {popupMessage}
                  <button onClick={() => setShowPopup(false)} style={{
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
         <div className=" mt-4 filter-container text-center">
            <p className="mt-3">Serach By: </p>
            <input
               type="text"
               placeholder="title"
               value={filterTitle}
               onChange={(e) => setFilterTitle(e.target.value)}
               style={{ width: '320px', maxWidth: '90%', padding: '8px 14px', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', marginRight: '10px' }}
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
               <option value="">All Courses</option>
               <option value="Paid">Paid</option>
               <option value="Free">Free</option>
            </select>
         </div>
         <div className='p-2 course-container'>
            {allCourses?.length > 0 ? (
               allCourses
                  .filter(
                     (course) =>
                        filterTitle === '' ||
                        course.C_title?.toLowerCase().includes(filterTitle?.toLowerCase())
                  )
                  .filter((course) => {
                     if (filterType === 'Free') {
                        return !isPaidCourse(course);
                     } else if (filterType === 'Paid') {
                        return isPaidCourse(course);
                     } else {
                        return true;
                     }
                  })
                  .filter((course, idx) => !trendingOnly || idx < 3) // Show only top 3 if trendingOnly
                  .map((course, index) => (
                     <div key={course._id} className='course trending-course-card'>
                        <div className="card1">
                           <div className="desc">
                              <h3>Modules</h3>
                              {course.sections.length > 0 ? (
                                 course.sections.slice(0, 2).map((section, i) => (
                                    <div key={i}>
                                       <p><b>Title:</b> {section.S_title}</p>
                                       <div className="description-container">
                                          <div className="description">
                                             <b>Description:</b> {section.S_description}
                                          </div>
                                       </div>
                                       <hr />
                                    </div>
                                 ))
                              ) : (
                                 <p>No Modules</p>
                              )}

                              <p style={{ fontSize: 20, fontWeight: 600 }}>many more to watch..</p>
                           </div>
                           <div className="details">
                              <div className="center">
                                 <h1>
                                    <span className="course-title-ellipsis">{course.C_title}</span><br />
                                    <span>{course.C_categories}</span><br />
                                    <span style={{ fontSize: 10 }}>by: &nbsp;{course.C_educator}</span>
                                 </h1>

                                 <p>Sections: {course.sections.length}</p>
                                 <p>Price(Rs.): {course.C_price}</p>
                                 <p>Enrolled students: {course.enrolled}</p>
                                 {user.userLoggedIn === true ?
                                    <>
                                       {isCoursePurchased(course._id) || enrolledCourseIds.includes(course._id) ? (
                                          <Button
                                             className="custom-btn"
                                             variant='outline-success'
                                             size='sm'
                                             onClick={() => navigate(`/courseSection/${course._id}/${course.C_title}`)}
                                          >
                                             Continue
                                          </Button>
                                       ) : (
                                          <Button
                                             className="custom-btn"
                                             variant='outline-dark'
                                             size='sm'
                                             onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                                          >
                                             Start Course
                                          </Button>
                                       )}
                                       <Modal show={showModal[index]} onHide={() => handleClose(index)} dialogClassName="payment-modal">
                                          <Modal.Header closeButton style={{background: 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18}}>
                                             <Modal.Title style={{fontWeight:700, color:'#222', letterSpacing:1}}>
                                                <span style={{fontSize:22, color:'#ff5252', marginRight:8}}><i className="bi bi-credit-card"></i></span>
                                                Payment for {course.C_title}
                                             </Modal.Title>
                                          </Modal.Header>
                                          <Modal.Body style={{background:'#fff', borderRadius:18, boxShadow:'0 4px 24px #ffe08299', padding:'32px 28px'}}>
                                             <div style={{marginBottom:18, fontWeight:600, color:'#555', fontSize:16}}>
                                                <span style={{color:'#29b6f6'}}>Educator:</span> {course.C_educator}<br/>
                                                <span style={{color:'#ffb300'}}>Price:</span> <span style={{fontWeight:700, color:'#ff5252'}}>{course.C_price}</span>
                                             </div>
                                             <Form onSubmit={(e) => handlePaymentSubmit(e, course._id)}>
                                                <Form.Group className="mb-3">
                                                   <Form.Label style={{fontWeight:600, color:'#222'}}>Card Holder Name</Form.Label>
                                                   <Form.Control name='cardholdername' value={cardDetails.cardholdername} onChange={handleCardInput} type="text" placeholder="Cardholder's Name" required style={{borderRadius:8, border:'1px solid #ccc', fontSize:16, padding:'10px 14px'}} isInvalid={!!formErrors.cardholdername} />
                                                   {formErrors.cardholdername && <Form.Text style={{color:'#d32f2f', fontWeight:600}}>{formErrors.cardholdername}</Form.Text>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                   <Form.Label style={{fontWeight:600, color:'#222'}}>Card Number</Form.Label>
                                                   <Form.Control name='cardnumber' value={cardDetails.cardnumber} onChange={handleCardInput} type="text" inputMode="numeric" placeholder="1234 5678 9012 3457" required style={{borderRadius:8, border:'1px solid #ccc', fontSize:16, padding:'10px 14px'}} isInvalid={!!formErrors.cardnumber} maxLength={16} />
                                                   {formErrors.cardnumber && <Form.Text style={{color:'#d32f2f', fontWeight:600}}>{formErrors.cardnumber}</Form.Text>}
                                                </Form.Group>
                                                <div className="d-flex gap-3 mb-3">
                                                   <Form.Group style={{flex:1}}>
                                                      <Form.Label style={{fontWeight:600, color:'#222'}}>Expiration</Form.Label>
                                                      <Form.Control name='expmonthyear' value={cardDetails.expmonthyear} onChange={handleCardInput} type="text" placeholder="MM/YYYY" required style={{borderRadius:8, border:'1px solid #ccc', fontSize:16, padding:'10px 14px'}} isInvalid={!!formErrors.expmonthyear} maxLength={7} />
                                                      {formErrors.expmonthyear && <Form.Text style={{color:'#d32f2f', fontWeight:600}}>{formErrors.expmonthyear}</Form.Text>}
                                                   </Form.Group>
                                                   <Form.Group style={{flex:1}}>
                                                      <Form.Label style={{fontWeight:600, color:'#222'}}>CVV</Form.Label>
                                                      <Form.Control name='cvvcode' value={cardDetails.cvvcode} onChange={handleCardInput} type="text" inputMode="numeric" placeholder="CVV" required style={{borderRadius:8, border:'1px solid #ccc', fontSize:16, padding:'10px 14px'}} isInvalid={!!formErrors.cvvcode} maxLength={3} />
                                                      {formErrors.cvvcode && <Form.Text style={{color:'#d32f2f', fontWeight:600}}>{formErrors.cvvcode}</Form.Text>}
                                                   </Form.Group>
                                                </div>
                                                <div className="d-flex justify-content-end gap-3 mt-4">
                                                   <Button variant="secondary" style={{fontWeight:600, minWidth:100, borderRadius:8}} onClick={() => handleClose(index)}>
                                                      Cancel
                                                   </Button>
                                                   <Button variant="danger" type='submit' style={{fontWeight:600, minWidth:100, borderRadius:8, background:'linear-gradient(90deg, #ff5252 0%, #ffb300 100%)', border:'none'}}>
                                                      Pay Now
                                                   </Button>
                                                </div>
                                             </Form>
                                          </Modal.Body>
                                       </Modal>
                                    </>

                                    : <Link to={'/login'}><Button
                                       className=""
                                       variant='outline-dark'
                                       size='sm'
                                    >
                                       Start Course
                                    </Button></Link>}

                              </div>
                           </div>
                        </div>
                     </div>
                  ))
            ) : (
               <p>No courses at the moment</p>
            )}
         </div>
      </>
   );
};

export default AllCourses;
