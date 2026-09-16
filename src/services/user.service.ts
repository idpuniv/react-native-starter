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

export interface CreateUserPayload {
  nom:           string;
  prenom:        string;
  email:         string;
  telephone:     string;
  dateNaissance: string;
  motDePasse:    string;
}

const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id: string | number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await api.post('/users', payload);
    return response.data;
  },
};

export default userService;