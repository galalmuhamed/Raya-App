import { MdCopyright } from 'react-icons/md';

const Footer = () => {
	return (
		<footer className="w-full h-10 flex items-center  text-lg border-t-2 border-stone-400 shadow-lg pl-16 text-gray-600">
			<MdCopyright />
			<span className="ml-2 text-xs italic font-Roboto font-semibold tracking-wider">
				All Right Reserved 2022
			</span>
		</footer>
	);
};

export default Footer;
