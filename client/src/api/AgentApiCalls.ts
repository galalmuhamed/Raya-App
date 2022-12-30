import { AgentRequest } from '../types';
import { api } from './api';

const config = (token: string) => {
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

export const getAgents = async (sort: string, token: string) => {
	const res = await api.get(
		`/Agent${sort !== 'all' ? '?sort=' + sort : ''}`,
		config(token)
	);
	return res.data;
};

type AgentReqWithToken = { token: string } & AgentRequest;

export const addAgent = async (data: AgentReqWithToken) => {
	const res = await api.post(
		'/Agent',
		{ name: data.name, status: data.status, userId: data.userId },
		config(data.token)
	);
	return res.data;
};

export const getAgentById = async (id: number, token: string) => {
	const res = await api.get(`/Agent/${id}`, config(token));
	return res.data;
};

type ReqWithId = { id: number } & AgentReqWithToken;
export const updateAgent = async (data: ReqWithId) => {
	const res = await api.put(
		`/Agent/${data.id}`,
		{
			name: data.name,
			status: data.status,
			userId: data.userId,
		},
		config(data.token)
	);
	return res.data;
};

type DeleteProp = { id: number; token: string };
export const deleteAgent = async (data: DeleteProp) => {
	const res = await api.delete(`/Agent/${data.id}`, config(data.token));
	return res.data;
};
