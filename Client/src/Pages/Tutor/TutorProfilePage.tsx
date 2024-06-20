import React, { useState } from "react";
import TutorBio from '../../Components/Tutor/TutorProfile/TutorBio'

function TutorProfilePage() {
    const [state, setState]:any = useState(0);
  return (
    <div>

        <TutorBio/>
    </div>
  )
}

export default TutorProfilePage