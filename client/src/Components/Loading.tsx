import { FC } from 'react';
import { FallingLines } from 'react-loader-spinner';
interface Props {
	width: number;
}

const Loading: FC<Props> = ({ width }) => {
	return (
		<FallingLines color="#3b3b3b" width={width.toString()} visible={true} />
	);
};

export default Loading;
