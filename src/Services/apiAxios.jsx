import axios from 'axios';

const apiAxios = axios.create({
    baseURL: process.env.REACT_APP_API
});

//Interceptors
apiAxios.interceptors.request.use(
    async (config) => {
        try {
            //Recuperar o token
            const user = JSON.parse(localStorage.getItem('user'));

            if (user) {
                config.headers =
                {
                    'Authorization': `Bearer ${user.acessToken}`,
                }
            }
            return config;

        }
        catch (error) {
            throw error
        }

    });

export default apiAxios;