import { BrowserRouter as Router, Route,  Routes} from "react-router-dom"
import React from "react"
import { Toaster } from "sonner";
import StudentRouter from "./Routes/StudentRouter"
import TutorRouter from "./Routes/TutorRouter"
import AdminRouter from "./Routes/AdminRouter"
// import PaymentRouter from "./Routes/PaymentRouter";
function App() {
  return (
    <>
      <Toaster />
      <Router>
      <Routes>
        <Route path = "/*" element = {<StudentRouter/>} />         //user router
        <Route path = "/tutor/*" element = {<TutorRouter/>} />    //tutor router
        <Route path = "/admin/*" element = {<AdminRouter/>} />      //admin router
        {/* <Route path = "/payment/*" element = {<PaymentRouter/>} />  //payment router */}
      </Routes>
    </Router>
    </>
  )
}

export default App