import { api } from './api';
import { AddUserRequesttype, SignInType } from '../types';

export const createUser = async (data: AddUserRequesttype) => {
	const res = await api.post('/Users', data);
	//const object = JSON.parse(atob(res.data.split('.')[1]));
	return res.data;
};
export const signIn = async (data: SignInType) => {
	const res = await api.post('/Users/signIn', data);
	return res.data;
};
