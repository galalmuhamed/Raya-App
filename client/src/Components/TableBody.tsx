import React, { FC } from 'react';
import { AgentType } from '../types';
import { AgentStatus } from '../types';
import moment from 'moment';

interface Props {
	data: AgentType;
	setAgentId: React.Dispatch<React.SetStateAction<number>>;
	setModelIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableBody: FC<Props> = ({ data, setAgentId, setModelIsOpen }) => {
	const createdDate = moment(data.createdAt).startOf('minute').fromNow(true);
	return (
		<tr className={'odd:bg-white even:bg-[#F5F5F5] capitalize font-Poppins '}>
			<td className="py-3 px-5 ">{data.id}</td>
			<td className="py-3 px-5 whitespace-nowrap text-xs sm:text-sm tracking-wider w-full">
				{data.name}
			</td>
			<td className="py-3 px-5 whitespace-nowrap text-xs sm:text-sm tracking-wider">
				{createdDate}
			</td>
			<td className={`py-3 px-5 text-md `}>
				<span
					className={`px-1 py-1 font-semibold rounded-md  text-xs sm:text-sm ${
						data.status === AgentStatus.New
							? 'bg-red-300 text-white'
							: 'bg-green-300 text-white '
					}`}
				>
					{AgentStatus[data.status]}
				</span>
			</td>
			<td className="py-3 px-5">
				<button
					className="btn-primary bg-blue-600 hover:ring-blue-800  text-xs sm:text-sm"
					onClick={() => {
						setModelIsOpen(true);
						setAgentId(data.id as number);
					}}
				>
					View
				</button>
			</td>
		</tr>
	);
};

export default TableBody;
