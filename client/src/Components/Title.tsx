import React, { FC } from 'react';
interface Props {
	title: string;
}

const Title: FC<Props> = ({ title }) => {
	return (
		<h1 className="text-xl font-Roboto font-semibold text-center sm:text-3xl">
			{title}
		</h1>
	);
};

export default Title;
