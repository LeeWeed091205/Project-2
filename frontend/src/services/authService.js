import api from "./api";

const authService = {
    login:(data)=> api.post(`/auth/login`,data),
    register:(data) => api.post(`/auth/register`,data),
    updatePassword: (data) => api.post(`/auth/update-password`,data)
}

export default authService