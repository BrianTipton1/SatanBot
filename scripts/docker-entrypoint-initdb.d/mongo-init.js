db.createUser({
    user: 'root',
    pwd: 'satans-passwd',
    roles: [
        {
            role: 'readWrite',
            db: 'satandb',
        },
    ],
});
