
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

function VideoCall() {
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = useCallback(() => {
        if (value) {
            navigate(`/tutor/room/${value}`);
        }
    }, [navigate, value]);

    return (
<div className="bg-gray-100">
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-xl font-semibold mb-4">Join Room</h1>
        <p className="text-gray-600 mb-6">
         Room Code
        </p>
        <div className="mb-4">
          <input
                          value={value}
                          onChange={(e) => setValue(e.target.value)}

                          type="text"
                          placeholder="Enter Room Code"
                          className="roomcode-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:border-blue-500"
          />
        </div>
        <button onClick={handleJoinRoom} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
          Join
        </button>
      </div>
    </div>
  </div>




    );
}

export default VideoCall;
