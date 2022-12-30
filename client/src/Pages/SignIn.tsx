import { FC, useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { signIn } from '../api/UserApiCalls';
import FormGroup from '../Components/FormGroup';
import LayoutForm from '../Components/LayoutForm';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../types';

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const LoginPage: FC<Props> = ({ setIsAuth }) => {
	const [formGroup, setFormGroup] = useState({
		userName: '',
		password: '',
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormGroup(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};
	const navigate = useNavigate();

	const { mutate, isLoading, isError, error } = useMutation(signIn, {
		onSuccess: data => {
			setIsAuth(data);
			navigate('/');
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate({ username: formGroup.userName, password: formGroup.password });
	};

	useEffect(() => {
		document.title = 'Sign In | Raya';
		return () => {
			document.title = 'Raya';
		};
	}, []);
	return (
		<main className="main-height flex justify-center items-center">
			<LayoutForm
				title="Log In"
				btnText="Sign In"
				btnDisabled={
					formGroup.userName.trim() === '' || formGroup.password.trim() === ''
				}
				loading={isLoading}
				isError={isError}
				errorMessage={error}
				onSubmit={handleSubmit}
			>
				<FormGroup
					type="input"
					htmlFor="userName"
					name={'userName'}
					inputType={'text'}
					placeholder={'User Name'}
					maxLength={50}
					text={'User Name'}
					verticalArrow={true}
					textLength={formGroup.userName.length}
					value={formGroup.userName}
					onChange={onChange}
				/>
				<FormGroup
					type="input"
					htmlFor="password"
					name={'password'}
					inputType={'password'}
					placeholder={'password'}
					maxLength={15}
					text={'password'}
					verticalArrow={true}
					textLength={formGroup.password.length}
					value={formGroup.password}
					onChange={onChange}
				/>
				<div className="text-left capitalize text-sm font-Roboto text-gray-500">
					If You Don't have an Account
					<Link
						to={'/login/signup'}
						className="text-blue-700 underline cursor-pointer ml-1"
					>
						Register Now
					</Link>
				</div>
			</LayoutForm>
		</main>
	);
};

export default LoginPage;
