export interface RoleType {
	id: number;
	name: string;
}

export interface UserType {
	id?: number;
	username: string;
	createdDate: Date;
	roleName: string;
	token: string;
}

export interface AgentType {
	id?: number;
	name: string;
	status: AgentStatus;
	createdAt: Date;
}

export enum AgentStatus {
	New,
	Approved,
}
//requests
export interface AddUserRequesttype {
	username: string;
	roleId: number;
	password: string;
}

export interface SignInType {
	username: string;
	password: string;
}

export interface AgentRequest {
	name: string;
	status: AgentStatus;
	userId: number;
}

export const sortData = [
	{ text: 'New', value: 'new' },
	{ text: 'Approved', value: 'approved' },
	{ text: 'Oldest Date', value: 'oldestDates' },
	{ text: 'Newest Date', value: 'newestDates' },
	{ text: 'Newest Date With Status New', value: 'filterOnlyNewWithNewestDate' },
	{
		text: 'Newest Date With Status Approved',
		value: 'filterOnlyApprovedWithNewestDate',
	},
];
