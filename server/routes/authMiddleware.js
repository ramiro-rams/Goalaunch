function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.status(401).json({message: "Not authenticated. Log in to perform action"})
    }
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        res.status(401).json({message: "Already logged in. Log out to perform action."})
    }
    else{
        next()
    }
}

module.exports = {
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated
}