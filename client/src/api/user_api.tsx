import ApiManager from "./ApiManage";

export const user_login = async data => {
    try {
        const result = await ApiManager("/auth/access_token", {
            method: "POST", 
            headers: {
                'content-type': "application/json"
            },
            data: data
        })
        return result;
    } catch (error:any) {
        return error.response;
    }
}