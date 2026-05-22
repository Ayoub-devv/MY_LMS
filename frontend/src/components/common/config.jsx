const NGROK_API = 'https://correct-spiffy-exorcism.ngrok-free.dev/api';
export const apiUrl = import.meta.env.VITE_API_URL || NGROK_API;
export const fileUrl = (import.meta.env.VITE_API_URL || NGROK_API).replace('/api', '');

const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');

export const userToken = userInfo?.token || null;
export const userId = userInfo?.id || null;