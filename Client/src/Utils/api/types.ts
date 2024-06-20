export type registerStudent = {
    studentname: string;
    studentemail: string;
    phone: string;
    password: string;
}


export type loginStudent = {
    studentemail: string;
    password: string;
}

export type registerTutor = {
    tutorname: string;
    tutoremail: string;
    phone: string;
    password: string

}

export type loginTutor = {
    tutoremail: string;
    password: string;
}


export type loginAdmin = {
    adminemail: string;
    password: string

}

export type AdminCategoryData = {
    categoryname: string;
    description: string;
  }


  export type courseBio = {
    courseName: string;
    courseDescription: string;
    courseDuration: string;
    isApproved: any;
    category: string;
    coursefee: any;
    image:any;
    courseLevel: any;
    tutorId : string
  }