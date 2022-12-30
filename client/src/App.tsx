import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import Header from './Components/Header';
import Footer from './Components/Footer';
import NotFound from './Pages/NotFound';
import ProtectedRoute from './Components/ProtectedRoute';
import { UserType } from './types';

const App = () => {
	const [isAuth, setIsAuth] = useState<UserType | null>(null);
	console.log(isAuth);
	return (
		<div className="bg-gradient-to-b from-white to-[#F5F5F5] min-h-[100vh]">
			<Header isAuth={isAuth} setIsAuth={setIsAuth} />
			<Routes>
				<Route
					path="/login/signin"
					element={<SignIn setIsAuth={setIsAuth} />}
				/>
				<Route
					path="/login/signup"
					element={<SignUp setIsAuth={setIsAuth} />}
				/>

				<Route
					path="/"
					element={
						<ProtectedRoute isAuth={isAuth}>
							<Dashboard isAuth={isAuth} />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
			<Footer />
		</div>
	);
};

export default App;
