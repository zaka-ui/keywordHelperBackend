const userRoutes = [
    {path : `/users/:id`, method : "GET"},
    {path: '/users', method : 'GET'},
    {path : `/users`, method : "POST"},
    {path: '/users/:id', method: 'PUT'},
    {path: '/users/:id', method : "DELETE"},
];



module.exports = userRoutes;