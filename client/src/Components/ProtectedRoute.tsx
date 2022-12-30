import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { UserType } from '../types';

interface Props {
	isAuth: UserType | null;
	children: JSX.Element;
}

const ProtectedRoute: FC<Props> = ({ isAuth, children }): any => {
	if (isAuth === null) {
		return <Navigate to="/login/signup" replace />;
	}

	return children;
};

export default ProtectedRoute;
