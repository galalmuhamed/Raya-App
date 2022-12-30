import React, { FC } from 'react';
import Loading from './Loading';
import Title from './Title';
interface Props {
	title: string;
	children: React.ReactNode;
	btnText: string;
	btnDisabled?: boolean;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
	loading?: boolean;
}
type ErrorType =
	| { isError: boolean; errorMessage: unknown }
	| { isError?: never; errorMessage?: never };
type DeleteType =
	| {
			deleteBtn: boolean;
			deleteBtnFunc: () => void;
			deleteBtnDisabled: boolean;
	  }
	| { deleteBtn?: never; deleteBtnFunc?: never; deleteBtnDisabled?: never };

type Propss = ErrorType & DeleteType & Props;

const LayoutForm: FC<Propss> = ({
	title,
	children,
	btnText,
	btnDisabled,
	onSubmit,
	isError,
	errorMessage,
	loading,
	deleteBtn,
	deleteBtnFunc,
	deleteBtnDisabled,
}) => {
	return (
		<form
			className="w-[90%] mx-auto bg-white shadow-lg py-5 px-10 rounded-md z-[1] relative sm:w-[60%]"
			onSubmit={onSubmit}
		>
			<Title title={title} />
			{children}

			{isError && (
				<div className="bg-red-600 mt-2 py-3 px-2 text-center text-xs rounded-md font-Roboto font-semibold text-white tracking-widest capitalize">
					{(errorMessage as any) &&
					typeof (errorMessage as any).response.data == 'string'
						? (errorMessage as any).response.data
						: (errorMessage as any).message}
				</div>
			)}
			<div className="flex items-center justify-center mt-3 space-x-4">
				<button
					disabled={btnDisabled}
					className="btn-primary py-2 px-4 "
					type="submit"
				>
					{btnText}
				</button>
				{deleteBtn && (
					<button
						disabled={deleteBtnDisabled}
						type={'button'}
						onClick={deleteBtnFunc}
						className="btn-primary py-2 px-4 bg-red-600 hover:ring-red-800"
					>
						Delete
					</button>
				)}
			</div>
			{loading && (
				<div className="absolute bottom-5 left-5">
					<Loading width={50} />
				</div>
			)}
		</form>
	);
};

export default LayoutForm;
