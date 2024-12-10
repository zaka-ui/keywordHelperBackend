const authRoutes = [
    {path : `/login`, method : "POST"},
	{path: '/logout', method : "POST"},
    {path:"/forgotPassword", method	: "POST"},
    {path : `/resetPassword`, method : "POST"},
	{path : `/verifyEmail`, method : "POST"},
    {path : `/verifyResetToken`, method : "POST"},
];




module.exports = authRoutes;