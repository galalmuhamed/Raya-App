import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	addAgent,
	getAgentById,
	updateAgent,
	deleteAgent,
} from '../api/AgentApiCalls';
import { AgentStatus, AgentType, UserType } from '../types';
import FormGroup from './FormGroup';
import LayoutForm from './LayoutForm';
import Loading from './Loading';

interface Props {
	setModelIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	agentId?: number;
	isAuth: UserType | null;
	sort: string;
	setSort: React.Dispatch<React.SetStateAction<string>>;
}

const Model: FC<Props> = ({
	setModelIsOpen,
	agentId,
	isAuth,
	sort,
	setSort,
}) => {
	const [formGroup, setFormGroup] = useState({
		name: '',
		status: '',
	});
	//const [error, setError] = useState('');

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormGroup(prev => ({ ...prev, [name]: value }));
	};

	const enumValues = Object.keys(AgentStatus).filter(elm =>
		isNaN(elm as unknown as number)
	);
	const queryClient = useQueryClient();

	//createAgent
	const {
		mutate: cAgent,
		isLoading: cLoading,
		isError: cIsError,
		error: cError,
	} = useMutation(addAgent, {
		onSuccess: data => {
			console.log(data);
			queryClient.setQueryData(['agents', sort], (old: any) => [...old, data]);
			setFormGroup({
				name: '',
				status: '',
			});
			setModelIsOpen(false);
			setSort('all');
		},
		onError: error => {
			console.log(error);
		},
	});

	//getAgent ()
	const { data: agentData, isLoading: gLoading } = useQuery(
		['agent', agentId],
		() => getAgentById(agentId as number, isAuth?.token as string),
		{
			enabled: agentId !== 0,
		}
	);

	//update agent
	const {
		mutate: uAgent,
		isLoading: uLoading,
		isError: uIsError,
		error: uError,
	} = useMutation(updateAgent, {
		onSuccess: data => {
			console.log(data);
			queryClient.setQueryData(['agent', agentId], data);
			queryClient.setQueryData(['agents', sort], (old: unknown) => {
				return (old as unknown as AgentType[]).map(elm => {
					if (elm.id === agentId) {
						return {
							...elm,
							name: data.name,
							status: data.status,
						};
					}
					return elm;
				});
			});
			setModelIsOpen(false);
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (agentId) {
			uAgent({
				id: agentId,
				name: formGroup.name.toLowerCase().trim(),
				status: formGroup.status as unknown as AgentStatus,
				token: isAuth?.token as string,
				userId: isAuth?.id as number,
			});
		} else {
			cAgent({
				name: formGroup.name.toLowerCase().trim(),
				status: formGroup.status as unknown as AgentStatus,
				token: isAuth?.token as string,
				userId: isAuth?.id as number,
			});
		}
	};

	//delete Agent
	const {
		mutate: dAgent,
		isLoading: dLoading,
		isError: dIsError,
		error: dError,
	} = useMutation(deleteAgent, {
		onSuccess: data => {
			console.log(data);
			queryClient.setQueryData(['agents', sort], (old: unknown) =>
				(old as unknown as AgentType[]).filter(elm => elm.id !== agentId)
			);
			setModelIsOpen(false);
		},
	});

	const dropAgent = () => {
		if (agentId) {
			dAgent({ id: agentId, token: isAuth?.token as string });
		}
	};

	useEffect(() => {
		if (agentData) {
			setFormGroup(prev => ({
				...prev,
				name: agentData.name,
				status: agentData.status.toString(),
			}));
		}
	}, [agentData]);

	return (
		<section className="fixed inset-0 z-10 flex justify-center items-center">
			<div className="absolute w-full h-full bg-black opacity-30"></div>

			{agentId && gLoading ? (
				<div className="w-[400px] h-60 bg-white z-0 flex items-center justify-center rounded-md">
					<Loading width={50} />
				</div>
			) : (
				<LayoutForm
					title={agentId ? 'Update Agent' : 'Add Agent'}
					btnText={agentId ? 'Update' : 'Add'}
					onSubmit={handleSubmit}
					btnDisabled={
						(isAuth?.roleName === 'admin'
							? formGroup.name.trim() === '' || formGroup.status === ''
							: formGroup.name.trim() === '') ||
						(agentData &&
							agentData.name.trim() === formGroup.name.trim() &&
							agentData.status.toString() === formGroup.status)
					}
					loading={cLoading || uLoading || dLoading}
					isError={cIsError || uIsError || dIsError}
					errorMessage={cError || uError || dError}
					deleteBtn={agentId ? true : false}
					deleteBtnFunc={dropAgent}
					deleteBtnDisabled={
						agentData &&
						agentData.status === AgentStatus.Approved &&
						isAuth?.roleName !== 'admin'
					}
				>
					{/*button close model */}
					<button
						className="absolute top-3 right-10 font-bold text-2xl cursor-pointer sm:top-5"
						type={'button'}
						onClick={() => setModelIsOpen(false)}
					>
						x
					</button>
					{agentData &&
					agentData.status === AgentStatus.Approved &&
					isAuth?.roleName !== 'admin' ? (
						<div
							className={
								'my-5 text-left relative space-y-3 after:absolute after:top-0 after:-left-5 after:w-1 after:h-full after:bg-gray-400 after:focus-within:bg-black'
							}
						>
							<p className="inline-block capitalize font-Roboto text-sm font-semibold tracking-wider">
								Name
							</p>
							<div>{agentData.name}</div>
						</div>
					) : (
						<FormGroup
							type="input"
							htmlFor="name"
							inputType="text"
							maxLength={50}
							placeholder={'Agent Name'}
							text="Name"
							name="name"
							textLength={formGroup.name.length}
							value={formGroup.name}
							onChange={onChange}
							verticalArrow={true}
						/>
					)}

					{agentData ? (
						<div
							className={
								'my-5 text-left relative space-y-3 after:absolute after:top-0 after:-left-5 after:w-1 after:h-full after:bg-gray-400 after:focus-within:bg-black'
							}
						>
							<p className="inline-block capitalize font-Roboto text-sm font-semibold tracking-wider">
								Status
							</p>
							{isAuth?.roleName === 'admin' ? (
								<div>
									{enumValues.map((elm, idx) => (
										<span
											key={idx}
											onClick={() =>
												setFormGroup(prev => ({
													...prev,
													status: idx.toString(),
												}))
											}
											className={`btn-primary even:ml-3 cursor-pointer  ${
												formGroup.status === idx.toString()
													? 'text-xl odd:bg-red-300 odd:hover:ring-red-400 even:bg-green-300 even:hover:ring-green-400 '
													: 'text-sm bg-gray-500'
											}`}
										>
											{elm}
										</span>
									))}
								</div>
							) : (
								<p
									className={`w-fit px-2 py-2 font-semibold rounded-md  text-xs sm:text-sm ${
										agentData.status === AgentStatus.New
											? 'bg-red-300 text-white'
											: 'bg-green-300 text-white '
									}`}
								>
									{AgentStatus[agentData.status]}
								</p>
							)}
						</div>
					) : isAuth?.roleName === 'admin' ? (
						<FormGroup
							type="select"
							htmlFor="status"
							text="Status"
							name="status"
							value={formGroup.status as unknown as string}
							onChange={onChange}
							verticalArrow={true}
							dataType={'stringType'}
							data={enumValues}
							disabledValue="choose Status"
						/>
					) : null}
				</LayoutForm>
			)}
		</section>
	);
};

export default Model;
