const userEmails = [];

const authorize = (req, res, next) => {
    const { email } = req.query;
    let auth = true;
    let duplicate = false;

    for(let i = 0; i < userEmails.length; i++){
        if(email === userEmails[i].email){
            userEmails[i].requests++;
            duplicate = true;
            if(userEmails[i].requests > 5){
                auth = false;
            }
            break;
        }
    }

    if(!duplicate){
        userEmails.push({ email: email, requests: 1 });
    }

    if(!auth){
        res.status(429).send('Too many requests');
    }

    next();
}

module.exports = authorize;