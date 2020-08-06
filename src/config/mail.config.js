const GetConfig = () => {
    if(process.env.NODE_ENV === 'development'){
        return {
            apiKey: process.env.DEV_MAIL_GUN_API_KEY,
            domain: process.env.DEV_BAS_URL
        }
    }
    if(process.env.NODE_ENV === 'production'){

    }
    return null;
}
exports.GetConfig = GetConfig;