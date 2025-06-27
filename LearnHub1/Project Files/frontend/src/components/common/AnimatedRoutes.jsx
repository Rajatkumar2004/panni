import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransitionWrapper from "./PageTransitionWrapper";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CourseContent from "../user/student/CourseContent";
import { useContext } from "react";
import { UserContext } from "../../App";

const AnimatedRoutes = () => {
  const location = useLocation();
  const { userLoggedIn } = useContext(UserContext);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransitionWrapper direction="right"><Home /></PageTransitionWrapper>} />
        <Route path="/login" element={<PageTransitionWrapper direction="left"><Login /></PageTransitionWrapper>} />
        <Route path="/register" element={<PageTransitionWrapper direction="left"><Register /></PageTransitionWrapper>} />
        {userLoggedIn ? (
          <>
            <Route path="/dashboard" element={<PageTransitionWrapper direction="right"><Dashboard /></PageTransitionWrapper>} />
            <Route path="/courseSection/:courseId/:courseTitle" element={<PageTransitionWrapper direction="right"><CourseContent /></PageTransitionWrapper>} />
          </>
        ) : (
          <Route path="/login" element={<PageTransitionWrapper direction="left"><Login /></PageTransitionWrapper>} />
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
