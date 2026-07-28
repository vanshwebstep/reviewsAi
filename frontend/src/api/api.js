import axios from 'axios';
// http://localhost/reviewsai/backend/api
// https://webstepdev.com/demo/reviewsai/backend/api
const BASE = import.meta.env.VITE_API_BASE_URL;

export const parseApiPayload = data => {
  if (data && typeof data === 'object') return data;
  if (typeof data !== 'string') return data || {};

  try {
    return JSON.parse(data);
  } catch {
    const start = data.indexOf('{');
    const end = data.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(data.slice(start, end + 1));
      } catch {
        return {};
      }
    }
    return {};
  }
};

const api = axios.create({
  transformResponse: [data => parseApiPayload(data)],
});

export const fetchPlans = () => api.get(`${BASE}/plans.php`);
export const submitSubscribe = data => api.post(`${BASE}/subscribe.php`, data);
export const createCheckoutSession = data => api.post(`${BASE}/create-checkout-session.php`, data);
export const confirmStripeSubscription = data => api.post(`${BASE}/confirm-stripe-subscription.php`, data);
export const generateQR = data => api.post(`${BASE}/generate-qr.php`, data);
export const loginUser = data => api.post(`${BASE}/login.php`, data);
export const generateAIReviews = data => api.post(`${BASE}/generate_reviews.php`, data);