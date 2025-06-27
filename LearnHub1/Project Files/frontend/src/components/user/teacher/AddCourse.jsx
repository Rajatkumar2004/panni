import React, { useState, useContext } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
   const user = useContext(UserContext);
   const navigate = useNavigate();
   const [addCourse, setAddCourse] = useState({
      userId: user.userData._id,
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });
   const [showPopup, setShowPopup] = useState(false);
   const [popupMessage, setPopupMessage] = useState("");

   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse({ ...addCourse, [name]: value });
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse({ ...addCourse, C_categories: e.target.value });
   };

   const addInputGroup = () => {
      setAddCourse({
         ...addCourse,
         sections: [
            ...addCourse.sections,
            {
               S_title: '',
               S_description: '',
               S_content: null,
            },
         ],
      });
   };

   const handleChangeSection = (index, e) => {
      const updatedSections = [...addCourse.sections];
      const sectionToUpdate = updatedSections[index];

      if (e.target.name.endsWith('S_content')) {
         sectionToUpdate.S_content = e.target.files[0];
      } else {
         sectionToUpdate[e.target.name] = e.target.value;
      }

      setAddCourse({ ...addCourse, sections: updatedSections });
   };

   const removeInputGroup = (index) => {
      const updatedSections = [...addCourse.sections];
      updatedSections.splice(index, 1);
      setAddCourse({
         ...addCourse,
         sections: updatedSections,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault()
      const formData = new FormData();
      Object.keys(addCourse).forEach((key) => {
         if (key === 'sections') {
            addCourse[key].forEach((section, index) => {
               if (section.S_content instanceof File) {
                  formData.append(`S_content`, section.S_content);
               }
               formData.append(`S_title`, section.S_title);
               formData.append(`S_description`, section.S_description);
            });
         } else {
            formData.append(key, addCourse[key]);
         }
      });

      for (const [key, value] of formData.entries()) {
         console.log(`${key}:`, value);
      }

      try {
         const res = await axiosInstance.post('/api/user/addcourse', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === 201) {
            if (res.data.success) {
               setPopupMessage(res.data.message || 'Course created successfully');
               setShowPopup(true);
               setTimeout(() => {
                  setShowPopup(false);
                  navigate('/teacher/home');
               }, 1800);
            } else {
               setPopupMessage('Failed to create course');
               setShowPopup(true);
               setTimeout(() => setShowPopup(false), 2500);
            }
         } else {
            setPopupMessage('Unexpected response status: ' + res.status);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2500);
         }
      } catch (error) {
         setPopupMessage('An error occurred while creating the course, only .mp4 videos can be uploaded');
         setShowPopup(true);
         setTimeout(() => setShowPopup(false), 2500);
      }
   };

   return (
      <div className='add-course-container'>
         {/* Popup for feedback */}
         {showPopup && (
            <div style={{
               position: 'fixed',
               top: 0, left: 0, right: 0, bottom: 0,
               background: 'rgba(0,0,0,0.18)',
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
                  borderRadius: '16px',
                  padding: '28px 36px',
                  boxShadow: '0 4px 24px #ffe08299',
                  minWidth: 280,
                  textAlign: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
               }}>
                  <span style={{fontSize: 22, marginRight: 8, color: '#66bb6a'}}><i className="bi bi-check-circle-fill"></i></span>
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
         <style>{`
            .add-course-container {
               background: linear-gradient(120deg, #e3f2fd 60%, #fffde7 100%);
               border-radius: 18px;
               box-shadow: 0 4px 24px rgba(41,182,246,0.10), 0 2px 8px rgba(255,179,0,0.10);
               padding: 32px 18px 24px 18px;
               margin: 32px auto;
               max-width: 700px;
            }
            .add-input-btn {
               background: linear-gradient(90deg, #29b6f6 0%, #ffe082 100%);
               color: #222;
               font-weight: 600;
               border: none;
               border-radius: 8px;
               box-shadow: 0 2px 8px #29b6f633;
               transition: background 0.2s, box-shadow 0.2s;
            }
            .add-input-btn:hover {
               background: linear-gradient(90deg, #ffe082 0%, #29b6f6 100%);
               color: #222;
               box-shadow: 0 4px 16px #29b6f655;
            }
            .submit-course-btn {
               background: linear-gradient(90deg, #66bb6a 0%, #ffe082 100%);
               color: #222;
               font-weight: 700;
               border: none;
               border-radius: 8px;
               box-shadow: 0 2px 8px #66bb6a33;
               transition: background 0.2s, box-shadow 0.2s;
               margin-top: 12px;
               min-width: 120px;
            }
            .submit-course-btn:hover {
               background: linear-gradient(90deg, #ffe082 0%, #66bb6a 100%);
               color: #222;
               box-shadow: 0 4px 16px #66bb6a55;
            }
         `}</style>
         <Form className="mb-3" onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridJobType">
                  <Form.Label>Course Type</Form.Label>
                  <Form.Select value={addCourse.C_categories} onChange={handleCourseTypeChange}>
                     <option>Select categories</option>
                     <option>IT & Software</option>
                     <option>Finance & Accounting</option>
                     <option>Personal Development</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control name='C_title' value={addCourse.C_title} onChange={handleChange} type="text" placeholder="Enter Course Title" required />
               </Form.Group>
            </Row>

            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Educator</Form.Label>
                  <Form.Control name='C_educator' value={addCourse.C_educator} onChange={handleChange} type="text" placeholder="Enter Course Educator" required />
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Price(Rs.)</Form.Label>
                  <Form.Control name='C_price' value={addCourse.C_price} onChange={handleChange} type="text" placeholder="for free course, enter 0" required />
               </Form.Group>
               <Form.Group as={Col} className="mb-3" controlId="formGridAddress2">
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control name='C_description' value={addCourse.C_description} onChange={handleChange} required as={"textarea"} placeholder="Enter Course description" />
               </Form.Group>
            </Row>

            <hr />

            {addCourse.sections.map((section, index) => (
               <div key={index} className="d-flex flex-column mb-4 border rounded-3 border-3 p-3 position-relative">
                  <Col xs={24} md={12} lg={8}>
                     <span style={{ cursor: 'pointer' }} className="position-absolute top-0 end-0 p-1" onClick={() => removeInputGroup(index)}>
                        ❌
                     </span>
                  </Col>
                  <Row className='mb-3'>
                     <Form.Group as={Col} controlId="formGridTitle">
                        <Form.Label>Section Title</Form.Label>
                        <Form.Control
                           name={`S_title`}
                           value={section.S_title}
                           onChange={(e) => handleChangeSection(index, e)}
                           type="text"
                           placeholder="Enter Section Title"
                           required
                        />
                     </Form.Group>
                     <Form.Group as={Col} controlId="formGridContent">
                        <Form.Label>Section Content (Video or Image)</Form.Label>
                        <Form.Control
                           name={`S_content`}
                           onChange={(e) => handleChangeSection(index, e)}
                           type="file"
                           accept="video/*,image/*"
                           required
                        />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Section Description</Form.Label>
                        <Form.Control
                           name={`S_description`}
                           value={section.S_description}
                           onChange={(e) => handleChangeSection(index, e)}
                           required
                           as={"textarea"}
                           placeholder="Enter Section description"
                        />
                     </Form.Group>
                  </Row>
               </div>
            ))}

            <Row className="mb-3">
               <Col xs={24} md={12} lg={8}>
                  <Button size='sm' variant='info' className='add-input-btn' onClick={addInputGroup}>
                     ➕Add Section
                  </Button>
               </Col>
            </Row>

            <Button variant="success" className='submit-course-btn' type="submit">
               Submit
            </Button>
         </Form>
      </div>
   );
};

export default AddCourse;
