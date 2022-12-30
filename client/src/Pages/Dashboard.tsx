import { useState, useEffect, FC } from 'react';
import { useQuery } from 'react-query';
import { getAgents } from '../api/AgentApiCalls';
import Loading from '../Components/Loading';
import Model from '../Components/Model';
import TableBody from '../Components/TableBody';
import { AgentType, UserType, sortData } from '../types';
interface Props {
	isAuth: UserType | null;
}

const Dashboard: FC<Props> = ({ isAuth }) => {
	const [sort, setSort] = useState('all');
	const [modelIsOpen, setModelIsOpen] = useState(false);
	const [agentId, setAgentId] = useState(0);

	const { data, isLoading, error, isError } = useQuery<AgentType[] | Error>(
		['agents', sort],
		() => getAgents(sort, isAuth?.token as string)
	);

	useEffect(() => {
		document.title = 'Dashboard | Raya';
		return () => {
			document.title = 'Raya';
		};
	}, []);

	if (isError) {
		return (error as any).response.status === 401 ? (
			<div>You have To Be Authenticated</div>
		) : (
			<div>{(error as any).message}</div>
		);
	}

	const d =
		(data as AgentType[]) && sort === 'all'
			? (data as AgentType[]).sort(
					(a, b) =>
						Date.parse(b.createdAt as unknown as string) -
						Date.parse(a.createdAt as unknown as string)
			  )
			: (data as AgentType[]);

	return (
		<main className="main-height  pt-12 pb-5">
			<div className="border-2 border-gray-500 w-[90%] mx-auto rounded-tl-md rounded-tr-md overflow-hidden shadow-lg sm:w-[80%]">
				{/*menu select and add*/}
				<div className="py-3 px-5 flex justify-between sm:px-10">
					<select
						value={sort}
						className="bg-[#F5F5F5] w-48 rounded-sm px-2 py-2 text-sm font-Roboto font-semibold capitalize"
						onChange={e => setSort(e.target.value)}
					>
						<option value="all">by Default</option>
						{sortData.map((elm, idx) => (
							<option key={idx} value={elm.value}>
								{elm.text}
							</option>
						))}
					</select>
					<button
						disabled={isLoading}
						className="btn-primary bg-green-600 hover:ring-green-800"
						onClick={() => {
							setModelIsOpen(true);
							setAgentId(0);
						}}
					>
						Add
					</button>
				</div>
				{/*table*/}
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className=" bg-gray-700 text-left text-white text-sm font-Roboto tracking-wider font-semibold capitalize sm:text-md">
								<th className="py-3 px-5 w-10">#Id</th>
								<th className="py-3 px-5">Name</th>
								<th className="py-3 px-5">Date</th>
								<th className="py-3 px-5">Status</th>
								<th className="py-3 px-5">View</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td colSpan={5} className="py-5">
										<div className="flex justify-center">
											<Loading width={100} />
										</div>
									</td>
								</tr>
							) : (
								d.map((elm, idx) => (
									<TableBody
										key={idx}
										data={elm}
										setAgentId={setAgentId}
										setModelIsOpen={setModelIsOpen}
									/>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
			{modelIsOpen && (
				<Model
					sort={sort}
					setSort={setSort}
					isAuth={isAuth}
					setModelIsOpen={setModelIsOpen}
					agentId={agentId}
				/>
			)}
		</main>
	);
};

export default Dashboard;
