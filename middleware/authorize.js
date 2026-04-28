// Higher-order function: authorize(...allowedRoles) returns the actual middleware
const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        // 1. Ensure authenticate middleware ran first (req.user must be set)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'You must be logged in to access this resource.'
            });
        }

        // 2. Check if the user's role is in the list of allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this resource.`
            });
        }

        // 3. Role check passed — proceed to the route handler
        next();
    };
};

module.exports = authorize;
