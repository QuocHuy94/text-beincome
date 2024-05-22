/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'group.beincom.com',
				port: '',
				pathname: '/_next/image',
			},
		],
	},
};

export default nextConfig;
