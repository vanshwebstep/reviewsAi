import axios from 'axios';

const BASE = 'https://webstepdev.com/demo/reviewsai/backend/api';

export const fetchPlans      = () => axios.get(`${BASE}/plans.php`);
export const submitSubscribe = (data) => axios.post(`${BASE}/subscribe.php`, data);
export const generateQR      = (data) => axios.post(`${BASE}/generate-qr.php`, data);