/** @type {import('next').NextConfig} */
const nextConfig = {
    module: {
        rules: [
            {
                test: /\.(bin|pdf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
        ]
    }
};

export default nextConfig;
