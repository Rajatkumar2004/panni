import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses, Tabs, Tab, Avatar, Box, Typography, Fade } from '@mui/material'
import { Person, Delete, School, Group } from '@mui/icons-material'
import axiosInstance from '../common/AxiosInstance'

// Gradient background for the whole admin panel
const GradientBox = styled(Box)(({ theme }) => ({
   minHeight: '100vh',
   width: '100vw',
   maxWidth: '90vw', // Fill the viewport
   overflowX: 'hidden',
   background: 'linear-gradient(100deg, #667eea 0%, #764ba2 50%)',
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'flex-start', // Move content to the left
   justifyContent: 'flex-start',
   paddingTop: theme.spacing(6),
   paddingBottom: theme.spacing(6),
   paddingLeft: theme.spacing(6), // Add left padding for spacing
   boxSizing: 'border-box',
}))

const Card = styled(Paper)(({ theme }) => ({
   maxWidth: 1000, // Fixed max width for the card
   width: '2000%', // Responsive width
   borderRadius: 24,
   boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
   padding: theme.spacing(4),
   background: 'rgba(255,255,255,0.95)',
   marginBottom: theme.spacing(4),
   overflowX: 'auto',
   marginLeft: 0,
   marginRight: 0,
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      color: theme.palette.common.white,
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 1,
      boxShadow: '0 2px 8px rgba(118,75,162,0.12)',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      background: 'rgba(245,245,255,0.7)',
   },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(102,126,234,0.07)',
   },
   '&:hover': {
      background: 'rgba(118,75,162,0.10)',
      transition: 'background 0.2s',
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}))

const ActionButton = styled(Button)(({ theme }) => ({
   borderRadius: 20,
   minWidth: 36,
   padding: '4px 12px',
   fontWeight: 600,
   boxShadow: '0 2px 8px rgba(118,75,162,0.10)',
   transition: 'background 0.2s, color 0.2s',
   '&:hover': {
      background: '#ff1744',
      color: '#fff',
   },
}))

const EmptyState = ({ icon, text }) => (
   <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
      <Avatar sx={{ bgcolor: '#764ba2', width: 56, height: 56, mb: 2 }}>
         {icon}
      </Avatar>
      <Typography variant="h6" color="text.secondary">{text}</Typography>
   </Box>
)

const AdminHome = () => {
   const [allUsers, setAllUsers] = useState([])
   const [allCourses, setAllCourses] = useState([])
   const [allEnrollments, setAllEnrollments] = useState([])
   const [tab, setTab] = useState(0);
   const [loading, setLoading] = useState(true);
   const [loadingCourses, setLoadingCourses] = useState(false);
   const [loadingEnrollments, setLoadingEnrollments] = useState(false);

   const allUsersList = async () => {
      try {
         setLoading(true);
         const res = await axiosInstance.get('api/admin/getallusers', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllUsers(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   }

   const allCoursesList = async () => {
      try {
         setLoadingCourses(true);
         const res = await axiosInstance.get('api/admin/getallcourses', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllCourses(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoadingCourses(false);
      }
   }

   const allEnrollmentsList = async () => {
      try {
         setLoadingEnrollments(true);
         const res = await axiosInstance.get('api/admin/enrollments', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllEnrollments(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoadingEnrollments(false);
      }
   }

   useEffect(() => {
      allUsersList()
      allCoursesList()
      allEnrollmentsList()
   }, [])

   const deleteUser = async (userId) => {
      const confirmation = window.confirm('Are you sure you want to delete this user?')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/user/deleteuser/${userId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            allUsersList()
         } else {
            alert("Failed to delete the user")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   const teachers = allUsers.filter(user => user.type === 'Teacher');
   const students = allUsers.filter(user => user.type === 'Student');
   // Exclude admin from allUsers list
   const filteredUsers = allUsers.filter(user => user.type !== 'Admin');

   // Avatar icon by user type
   const getUserAvatar = (user) => {
      if (user.type === 'Teacher') return <Avatar sx={{ bgcolor: '#667eea', mr: 1 }}><School /></Avatar>;
      if (user.type === 'Student') return <Avatar sx={{ bgcolor: '#ffb300', mr: 1 }}><Group /></Avatar>;
      return <Avatar sx={{ bgcolor: '#764ba2', mr: 1 }}><Person /></Avatar>;
   }

   return (
      <GradientBox>
         <Card>
            <Typography variant="h4" fontWeight={700} align="center" gutterBottom sx={{ background: 'linear-gradient(90deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 3 }}>
               Admin Dashboard
            </Typography>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} centered sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 600, fontSize: 18 } }}>
               <Tab label="All Users" />
               <Tab label="Teachers" />
               <Tab label="Students" />
               <Tab label="Courses" />
               <Tab label="Enrollments" />
            </Tabs>
            <Fade in={!loading} timeout={600}>
               <Box>
                  {tab === 0 && (
                     <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(102,126,234,0.08)' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                           <TableHead>
                              <TableRow>
                                 <StyledTableCell>User</StyledTableCell>
                                 <StyledTableCell align="left">Email</StyledTableCell>
                                 <StyledTableCell align="left">Type</StyledTableCell>
                                 <StyledTableCell align="left">Action</StyledTableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {filteredUsers.length > 0 ? (
                                 filteredUsers.map((user) => (
                                    <StyledTableRow key={user._id}>
                                       <StyledTableCell component="th" scope="row">
                                          <Box display="flex" alignItems="center">
                                             {getUserAvatar(user)}
                                             <Box>
                                                <Typography fontWeight={600}>{user.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{user._id}</Typography>
                                             </Box>
                                          </Box>
                                       </StyledTableCell>
                                       <StyledTableCell>{user.email}</StyledTableCell>
                                       <StyledTableCell>{user.type}</StyledTableCell>
                                       <StyledTableCell>
                                          <ActionButton onClick={() => deleteUser(user._id)} size='small' color="error" startIcon={<Delete />}>Delete</ActionButton>
                                       </StyledTableCell>
                                    </StyledTableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={4} align="center">
                                       <EmptyState icon={<Person fontSize="large" />} text="No users found" />
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  )}
                  {tab === 1 && (
                     <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(102,126,234,0.08)' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="teachers table">
                           <TableHead>
                              <TableRow>
                                 <StyledTableCell>Teacher</StyledTableCell>
                                 <StyledTableCell align="left">Email</StyledTableCell>
                                 <StyledTableCell align="left">Type</StyledTableCell>
                                 <StyledTableCell align="left">Action</StyledTableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {teachers.length > 0 ? (
                                 teachers.map((user) => (
                                    <StyledTableRow key={user._id}>
                                       <StyledTableCell component="th" scope="row">
                                          <Box display="flex" alignItems="center">
                                             {getUserAvatar(user)}
                                             <Box>
                                                <Typography fontWeight={600}>{user.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{user._id}</Typography>
                                             </Box>
                                          </Box>
                                       </StyledTableCell>
                                       <StyledTableCell>{user.email}</StyledTableCell>
                                       <StyledTableCell>{user.type}</StyledTableCell>
                                       <StyledTableCell>
                                          <ActionButton onClick={() => deleteUser(user._id)} size='small' color="error" startIcon={<Delete />}>Delete</ActionButton>
                                       </StyledTableCell>
                                    </StyledTableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={4} align="center">
                                       <EmptyState icon={<School fontSize="large" />} text="No teachers found" />
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  )}
                  {tab === 2 && (
                     <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(102,126,234,0.08)' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="students table">
                           <TableHead>
                              <TableRow>
                                 <StyledTableCell>Student</StyledTableCell>
                                 <StyledTableCell align="left">Email</StyledTableCell>
                                 <StyledTableCell align="left">Type</StyledTableCell>
                                 <StyledTableCell align="left">Action</StyledTableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {students.length > 0 ? (
                                 students.map((user) => (
                                    <StyledTableRow key={user._id}>
                                       <StyledTableCell component="th" scope="row">
                                          <Box display="flex" alignItems="center">
                                             {getUserAvatar(user)}
                                             <Box>
                                                <Typography fontWeight={600}>{user.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{user._id}</Typography>
                                             </Box>
                                          </Box>
                                       </StyledTableCell>
                                       <StyledTableCell>{user.email}</StyledTableCell>
                                       <StyledTableCell>{user.type}</StyledTableCell>
                                       <StyledTableCell>
                                          <ActionButton onClick={() => deleteUser(user._id)} size='small' color="error" startIcon={<Delete />}>Delete</ActionButton>
                                       </StyledTableCell>
                                    </StyledTableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={4} align="center">
                                       <EmptyState icon={<Group fontSize="large" />} text="No students found" />
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  )}
                  {tab === 3 && (
                     <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(102,126,234,0.08)' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="courses table">
                           <TableHead>
                              <TableRow>
                                 <StyledTableCell>Course Title</StyledTableCell>
                                 <StyledTableCell align="left">Teacher</StyledTableCell>
                                 <StyledTableCell align="left">Category</StyledTableCell>
                                 <StyledTableCell align="left">Price</StyledTableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {loadingCourses ? (
                                 <TableRow><TableCell colSpan={4} align="center">Loading...</TableCell></TableRow>
                              ) : allCourses.length > 0 ? (
                                 allCourses.map((course) => (
                                    <StyledTableRow key={course._id}>
                                       <StyledTableCell>{course.C_title}</StyledTableCell>
                                       <StyledTableCell>{course.C_educator}</StyledTableCell>
                                       <StyledTableCell>{course.C_categories}</StyledTableCell>
                                       <StyledTableCell>{course.C_price}</StyledTableCell>
                                    </StyledTableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={4} align="center">
                                       <EmptyState icon={<School fontSize="large" />} text="No courses found" />
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  )}
                  {tab === 4 && (
                     <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(102,126,234,0.08)' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="enrollments table">
                           <TableHead>
                              <TableRow>
                                 <StyledTableCell>Student</StyledTableCell>
                                 <StyledTableCell align="left">Email</StyledTableCell>
                                 <StyledTableCell align="left">Course</StyledTableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {loadingEnrollments ? (
                                 <TableRow><TableCell colSpan={3} align="center">Loading...</TableCell></TableRow>
                              ) : allEnrollments.length > 0 ? (
                                 allEnrollments.map((enroll) => (
                                    <StyledTableRow key={enroll._id}>
                                       <StyledTableCell>{enroll.userId?.name || 'N/A'}</StyledTableCell>
                                       <StyledTableCell>{enroll.userId?.email || 'N/A'}</StyledTableCell>
                                       <StyledTableCell>{enroll.courseId?.C_title || 'N/A'}</StyledTableCell>
                                    </StyledTableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={3} align="center">
                                       <EmptyState icon={<Group fontSize="large" />} text="No enrollments found" />
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  )}
               </Box>
            </Fade>
         </Card>
      </GradientBox>
   )
}

export default AdminHome
