import axios from 'axios';
// http://localhost/reviewsai/backend/api
// https://webstepdev.com/demo/reviewsai/backend/api
const url = import.meta.env.VITE_API_BASE_URL
const BASE = url;


export const fetchPlans = () => axios.get(`${BASE}/plans.php`);
export const submitSubscribe = (data) => axios.post(`${BASE}/subscribe.php`, data);
export const generateQR = (data) => axios.post(`${BASE}/generate-qr.php`, data);
export const loginUser = (data) => axios.post(`${BASE}/login.php`, data);
export const generateAIReviews = (data) => axios.post(`${BASE}/generate_reviews.php`, data);
