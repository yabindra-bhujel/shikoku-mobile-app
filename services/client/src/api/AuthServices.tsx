import ApiManager from "../config/Api";

const AuthServices = {

    async  login(username: string, password: string) {
        try {
            const result = await ApiManager.post("/auth/access_token", {
                data: {
                    username: username,
                    password: password
                }
            })

            return result;
        } catch (error:any) {

            return error.response.data;
        }
    },

    async logout() {

    },

    async chanagePassword() {

    },

    async forgotPassword() {
        
    }
}


export default AuthServices;