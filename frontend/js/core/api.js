// Comunicación con backend y APIs externas
export const API = {
  baseURL: '/api',
  
  // Verificar si usuario está logueado
  async verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) return { logueado: false };
    
    try {
      const response = await fetch(`${this.baseURL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return { logueado: response.ok };
    } catch (error) {
      return { logueado: false };
    }
  },
  
  // Obtener datos de usuario
  async obtenerUsuario() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const response = await fetch(`${this.baseURL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }
};