import axios, { AxiosRequestConfig } from "axios";
const token=localStorage.getItem('Token')
export const api = axios.create({
	baseURL: "http://localhost:5000/",
	timeout: 5000,
	withCredentials:true,
	headers: {
		Authorization: `Bearer ${token}`,
	  }
}); 
 



export const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/",
	timeout: 5000,
	withCredentials: true,
	headers: {
	  'Content-Type': 'application/json',
	},
  });



  axiosInstance.interceptors.request.use(
	config => {
	  const accessToken = localStorage.getItem('Token')    
	if (accessToken) {
	  config.headers['Authorization'] = `Bearer ${accessToken}`;
	}
	return config;
  },
  error => {
	return Promise.reject(error);
  }
  );



  axiosInstance.interceptors.response.use(
	(response) => {
		console.log(response,'RESSSS');
		
	  return response;
	},
	async (error) => {
	  console.log("Axiox ERROR");        
	  console.log(error.response.data.errMessage,"error.responseerror.response");
	  
	  const originalRequest = error.config;
	  if(error.response.status === 403 ){
		localStorage.removeItem('Token')
	  }
	  if (error.response.status === 401 && !originalRequest._retry) {      
		originalRequest._retry = true;
		try {
		  const route:any = 'http://localhost:5000/student/refresh'
		  const refreshResponse = await axiosInstance.post(route);        
		  const newAccessToken = refreshResponse.data.token;
		 
		  localStorage.setItem('Token', newAccessToken);
		  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
		  return axiosInstance(originalRequest);
	  } catch (err) {
		  console.log(err);
		  console.log(window.location.href ,"window.location.href window.location.href window.location.href ");
		  
		  window.location.href = '/login';
		  console.error('Refresh token failed:', err);
	  }
	  }
	  return Promise.reject(error);
	}
  );
export const apiRequest = async (config: AxiosRequestConfig) => {
    console.log(config);
    
	try {
		const response = await api(config);
		return response;
	} catch (error) {
		console.error(error, "errr");
		return error;
	}
};

export const headerConfg = () => {
	const token = localStorage.getItem("adminToken");
	if (token) {
		return {
			Authorization: ` Bearer ${token}`
		};
	}
};



