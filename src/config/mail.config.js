if(process.env.NODE_ENV === "production"){
    module.exports = {
        'aws': {
            'key': process.env.key_DEV,
            'secret': process.env.secret_DEV,
            'ses': {
                'from': {
                    'default': process.env.default_from_email_DEV,
                },
                'region': process.env.region_DEV
            }
        }
    };
}