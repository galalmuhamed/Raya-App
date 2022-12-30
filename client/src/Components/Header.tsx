import { FC } from 'react';
import { UserType } from '../types';
import { AiOutlineLogout } from 'react-icons/ai';

interface Props {
	isAuth: UserType | null;
	setIsAuth: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const Header: FC<Props> = ({ isAuth, setIsAuth }) => {
	return (
		<header className="h-20">
			<nav
				className={`h-full flex items-center px-5 py-4 sm:px-14 ${
					isAuth ? 'justify-between' : 'justify-center'
				}`}
			>
				<div className={`h-full w-[200px] mix-blend-multiply`}>
					<img
						src="/raya.jpg"
						alt="logo"
						className="w-full h-full object-cover object-center"
					/>
				</div>
				{isAuth && (
					<div className="flex items-center space-x-3">
						<p className="font-Roboto font-semibold capitalize">
							{isAuth.username}
						</p>
						<div
							className="text-2xl cursor-pointer"
							onClick={() => setIsAuth(null)}
						>
							<AiOutlineLogout />
						</div>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;
