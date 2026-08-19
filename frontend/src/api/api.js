import axios from 'axios';
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

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchPlans = () => api.get(`${BASE}/plans.php`);
export const submitSubscribe = data => api.post(`${BASE}/subscribe.php`, data);
export const createCheckoutSession = data => api.post(`${BASE}/create-checkout-session.php`, data);
export const confirmStripeSubscription = data => api.post(`${BASE}/confirm-stripe-subscription.php`, data);
export const loginUser = data => api.post(`${BASE}/login.php`, data);
export const verifyToken = () => api.get(`${BASE}/verify_token.php`, { headers: authHeader() });
export const cancelSubscription = (payload) => api.post(`${BASE}/cancel_subscription.php`, payload, { headers: authHeader() });// Business profiles
export const getBusinessProfiles = subscriptionId =>
  api.get(`${BASE}/get_business_profiles.php`, { params: { subscription_id: subscriptionId }, headers: authHeader() });
export const addBusinessProfile = data => api.post(`${BASE}/add_business_profile.php`, data, { headers: authHeader() });
export const deleteBusinessProfile = data => api.post(`${BASE}/delete_business_profile.php`, data, { headers: authHeader() });
export const sendChatbotMessage = data => api.post(`${BASE}/chatbot.php`, data);
// Per-profile actions
export const generateQR = data => api.post(`${BASE}/generate-qr.php`, data, { headers: authHeader() });
export const generateAIReviews = data => api.post(`${BASE}/generate_reviews.php`, data, { headers: authHeader() });
export const saveKeyWords = data => api.post(`${BASE}/save_key_words.php`, data, { headers: authHeader() });

// Upgrade
export const createUpgradeCheckoutSession = data => api.post(`${BASE}/create-upgrade-checkout-session.php`, data, { headers: authHeader() });
export const confirmUpgradeSubscription = data => api.post(`${BASE}/confirm-upgrade-subscription.php`, data, { headers: authHeader() });


export const generateSmartReply = data => api.post(`${BASE}/generate_smart_reply.php`, data, { headers: authHeader() });
export const updateBusinessProfile = data =>
  api.post(`${BASE}/update-business-profile.php`, data, { headers: authHeader() });