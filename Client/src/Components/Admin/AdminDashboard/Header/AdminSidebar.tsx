import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <>
    <>
  {/* component */}
  <div className="flex h-screen w-64 flex-col justify-between bg-sky-600 text-white">
    <div className="p-4">
      {/* items */}
      <div className="mb-4">
        <div className="flex w-full items-center justify-between">
          <a className="flex w-full cursor-pointer items-center rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-zinc-800 hover:text-white">
          <svg
  xmlns="http://www.w3.org/2000/svg"
  width={16}
  height={16}
  fill="currentColor"
  className="bi bi-house-door"
  viewBox="0 0 16 16"
>
  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
</svg>

            <span className="ml-3 font-bold">Dashboard</span>
          </a>
        </div>
      </div>

      {/* item */}

      <div className="mb-4">
        <div className="flex w-full items-center justify-between">
        <Link to="/admin/admincategory" className="flex w-full cursor-pointer items-center rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-zinc-800 hover:text-white">
          <svg
  xmlns="http://www.w3.org/2000/svg"
  width={16}
  height={16}
  fill="currentColor"
  className="bi bi-list-task"
  viewBox="0 0 16 16"
>
  <path
    fillRule="evenodd"
    d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"
  />
  <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
  <path
    fillRule="evenodd"
    d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"
  />
</svg>



            <span className="ml-3 font-bold">Category</span>
            </Link>
        </div>
      </div>
      {/* item */}
      <div className="mb-4">
  <div className="flex w-full items-center justify-between">
    <Link to="/admin/adminstudent" className="flex w-full cursor-pointer items-center rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-zinc-800 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-mortarboard" viewBox="0 0 16 16">
        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z"/>
        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
      </svg>
      <span className="ml-3 font-bold">Students</span>
    </Link>
  </div>
</div>
      {/* item */}
      <div className="mb-4">
  <div className="flex w-full items-center justify-between">
    <Link to="/admin/admintutor" className="flex w-full cursor-pointer items-center rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-zinc-800 hover:text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="currentColor"
        className="bi bi-person-workspace"
        viewBox="0 0 16 16"
      >
        <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
        <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
      </svg>
      <span className="ml-3 font-bold">Tutors</span>
    </Link>
  </div>
</div>
      {/* item */}
      <div className="mb-4">
        <div className="flex w-full items-center justify-between">
          <a className="flex w-full cursor-pointer items-center rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-zinc-800 hover:text-white">
          <svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  className="bi bi-journal-text"
  viewBox="0 0 16 16"
>
  <path d="M14.5 0a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H1.5A1.5 1.5 0 0 1 0 13.5v-12A1.5 1.5 0 0 1 1.5 0h13zm0 1H1.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5zM5 9.5v-1h6v1H5zm0-2v-1h6v1H5zm0-2V4h6v1H5zm-2 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/>
</svg>
            <span className="ml-3 font-bold">Blog</span>
          </a>
        </div>
      </div>
       
        
      </div>
     
     
        </div>
      
   
    {/* Bottom */}

</>

    </>
  )
}

export default AdminSidebar