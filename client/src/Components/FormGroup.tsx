import { FC } from 'react';
import { RoleType } from '../types';
interface InputType {
	type: 'input';
	inputType: string;
	text: string;
	name: string;
	htmlFor: string;
	placeholder: string;
	maxLength: number;
	textLength: number;
	verticalArrow: boolean;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface SelectType {
	type: 'select';
	text: string;
	name: string;
	htmlFor: string;
	disabledValue: string;
	verticalArrow: boolean;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface DataRoleType extends SelectType {
	dataType: 'RoleType';
	data: RoleType[];
}
interface DataStringType extends SelectType {
	dataType: 'stringType';
	data: string[];
}

type Props = InputType | DataRoleType | DataStringType;

const FormGroup: FC<Props> = props => {
	const { type, text, name, htmlFor, value, onChange } = props;
	const { inputType, placeholder, maxLength, verticalArrow, textLength } =
		props as InputType;
	const { disabledValue } = props as DataRoleType;

	const { dataType, data } = props as DataRoleType | DataStringType;

	const remainingText = maxLength - textLength;
	return (
		<div
			className={` my-5 text-left relative space-y-3 ${
				verticalArrow
					? 'after:absolute after:top-0 after:-left-5 after:w-1 after:h-full after:bg-gray-400 after:focus-within:bg-black'
					: ''
			} `}
		>
			<label
				className="inline-block capitalize font-Roboto text-sm font-semibold tracking-wider"
				htmlFor={htmlFor}
			>
				{text}
			</label>
			{type === 'input' ? (
				<>
					<input
						className="w-full bg-[#F5F5F5] h-12 px-5 py-2 rounded-md outline-none focus:ring-1 focus:ring-black font-Poppins tracking-wide"
						type={inputType}
						id={htmlFor}
						name={name}
						placeholder={placeholder}
						maxLength={maxLength}
						value={value}
						onChange={onChange}
					/>
					<div
						className={`text-right pr-5 font-Poppins font-semibold text-sm text-gray-500 `}
					>
						<span
							className={`relative ${
								remainingText < 5
									? 'text-red-400'
									: remainingText < 10
									? 'text-yellow-300'
									: ''
							}  after:absolute after:-bottom-6 after:right-[50%] after:translate-x-[50%] after:text-[10px] leading-normal after:content-['Remaining_Charachters'] after:bg-[#94a3b887] after:py-1 after:px-2 after:rounded-md after:w-fit  after:text-black after:whitespace-nowrap after:hidden hover:after:block`}
						>
							{remainingText}
						</span>
					</div>
				</>
			) : (
				<select
					className="w-full bg-[#F5F5F5] h-12 px-5 py-2 rounded-md outline-none focus:ring-1 focus:ring-black font-Poppins tracking-wide capitalize "
					id={htmlFor}
					name={name}
					value={value}
					onChange={onChange}
				>
					<option disabled value={''} className={''}>
						{disabledValue}
					</option>
					{dataType === 'RoleType'
						? data.map((elm, idx) => (
								<option key={idx} value={elm.id}>
									{elm.name}
								</option>
						  ))
						: data.map((elm, idx) => (
								<option key={idx} value={idx}>
									{elm}
								</option>
						  ))}
				</select>
			)}
		</div>
	);
};

export default FormGroup;
