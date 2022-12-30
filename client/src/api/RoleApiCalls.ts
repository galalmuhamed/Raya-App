import { api } from './api';

export const getRoles = async () => {
	const res = await api.get('/Roles');
	return res.data;
};
