import axios from 'axios';
import { parseApiPayload } from './api';
const BASE = import.meta.env.VITE_API_BASE_URL;
const ADMIN = `${BASE}/admin`;

const adminAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// BASE hota hai ".../backend/api" — /api hata ke backend root nikal rahe hain
export const BACKEND_ROOT = BASE.replace(/\/api\/?$/, '');

export const resolveQrUrl = (qrPath) => {
  if (!qrPath) return '';
  if (/^https?:\/\//i.test(qrPath)) return qrPath; // already full URL ho toh as-is
  return `${BACKEND_ROOT}/${qrPath.replace(/^\/+/, '')}`;
};
const adminApi = axios.create({
  transformResponse: [data => parseApiPayload(data)],
});

export const adminLogin = data => adminApi.post(`${ADMIN}/admin-login.php`, data);

// Users
export const adminListUsers = () => adminApi.get(`${ADMIN}/list_users.php`, { headers: adminAuthHeader() });
export const adminUpdateUser = data => adminApi.post(`${ADMIN}/update_user.php`, data, { headers: adminAuthHeader() });
export const adminDeleteUser = data => adminApi.post(`${ADMIN}/delete_user.php`, data, { headers: adminAuthHeader() });
export const adminDeleteBusinessProfile = data => adminApi.post(`${ADMIN}/delete_business_profile.php`, data, { headers: adminAuthHeader() });

// Plans
export const adminListPlans = () => adminApi.get(`${ADMIN}/list_plans.php`, { headers: adminAuthHeader() });
export const adminAddPlan = data => adminApi.post(`${ADMIN}/add_plan.php`, data, { headers: adminAuthHeader() });
export const adminUpdatePlan = data => adminApi.post(`${ADMIN}/update_plan.php`, data, { headers: adminAuthHeader() });
export const adminDeletePlan = data => adminApi.post(`${ADMIN}/delete_plan.php`, data, { headers: adminAuthHeader() });

// Promo
export const adminGetPromoSettings = () => adminApi.get(`${ADMIN}/get_promo_settings.php`, { headers: adminAuthHeader() });
export const adminUpdatePromoSettings = data => adminApi.post(`${ADMIN}/update_promo_settings.php`, data, { headers: adminAuthHeader() });


export const adminGetDashboardStats = () => adminApi.get(`${ADMIN}/dashboard_stats.php`, { headers: adminAuthHeader() });
export const adminGenerateQR = data => adminApi.post(`${ADMIN}/generate-qr.php`, data, { headers: adminAuthHeader() });