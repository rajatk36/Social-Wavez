window.API_BASE_URL = "https://social-wavez.onrender.com";

window.apiRequest = async (endpoint, options = {}) => {
  const url = `${window.API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("sw_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};
