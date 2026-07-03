import api from './api';

export interface RegisterPayload {
  nom:           string;
  prenom:        string;
  telephone:     string;
  email:         string;
  dateNaissance: string;
  motDePasse:    string;
}

const registerService = {
  async register(payload: RegisterPayload) {
    const response = await api.post('/users', payload);
    return response.data;
  },
};

export default registerService;