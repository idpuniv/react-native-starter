import api from './api';

export interface User {
  id:            number;
  nom:           string;
  prenom:        string;
  email:         string;
  telephone:     string;
  dateNaissance: string;
  createdAt:     string;
}

const qrcodeService = {
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export default qrcodeService;