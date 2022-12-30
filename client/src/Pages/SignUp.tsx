import React, { FC, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { RoleType, AddUserRequesttype, UserType } from '../types';
import { getRoles } from '../api/RoleApiCalls';
import { createUser } from '../api/UserApiCalls';
import FormGroup from '../Components/FormGroup';
import LayoutForm from '../Components/LayoutForm';
import Loading from '../Components/Loading';

interface Props {
	setIsAuth: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const SignUp: FC<Props> = ({ setIsAuth }) => {
	const [formGroup, setFormGroup] = useState<AddUserRequesttype>({
		username: '',
		roleId: '' as unknown as number,
		password: '',
	});
	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setFormGroup(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};
	const navigate = useNavigate();

	//get all roles
	const {
		data: roleData,
		isLoading: roleLoading,
		error: rError,
		isError: rIsError,
	} = useQuery<RoleType[], Error>('roles', getRoles);

	//newuser
	const {
		isLoading: createLoading,
		mutate,
		isError,
		error,
	} = useMutation(createUser, {
		onSuccess: data => {
			setIsAuth(data);
			navigate('/');
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		mutate({
			username: formGroup.username,
			password: formGroup.password,
			roleId: formGroup.roleId
				? parseInt(formGroup.roleId as unknown as string)
				: 0,
		});
	};

	useEffect(() => {
		document.title = 'Sign Up | Raya';
		return () => {
			document.title = 'Raya';
		};
	}, []);

	if (roleLoading) {
		return (
			<div className="main-height flex items-center justify-center">
				<Loading width={100} />
			</div>
		);
	}
	if (rIsError) {
		return (
			<div className="main-height text-center mt-20 ">
				<span className="py-2 px-5 bg-red-600 w-fit rounded-md text-white font-semibold">
					{(rError as any)?.message}
				</span>
			</div>
		);
	}

	return (
		<main className="main-height flex justify-center items-center">
			<LayoutForm
				title="Register"
				btnText="Sign Up"
				onSubmit={handleSubmit}
				loading={createLoading}
				isError={isError}
				errorMessage={error}
				btnDisabled={
					formGroup.username.trim() === '' ||
					formGroup.password.trim() === '' ||
					formGroup.roleId === ('' as unknown as number)
				}
			>
				<FormGroup
					type="input"
					htmlFor="username"
					name={'username'}
					inputType={'text'}
					placeholder={'User Name'}
					maxLength={50}
					text={'User Name'}
					verticalArrow={true}
					textLength={formGroup.username.length}
					value={formGroup.username}
					onChange={onChange}
				/>
				<FormGroup
					type="select"
					htmlFor="role"
					name="roleId"
					text="role"
					disabledValue="Choose Role"
					verticalArrow={true}
					value={formGroup.roleId}
					onChange={onChange}
					dataType={'RoleType'}
					data={roleData as RoleType[]}
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
					If You Already Have an Account
					<Link
						to={'/login/signin'}
						className="text-blue-700 underline cursor-pointer ml-1"
					>
						Log In Now...
					</Link>
				</div>
			</LayoutForm>
		</main>
	);
};

export default SignUp;
