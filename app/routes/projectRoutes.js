module.exports = [
    {path : `/project/:id`, method : "GET"},
    {path: 'users/:id/projects', method : 'GET'},
    {path : `/projects`, method : "POST"},
    {path: '/projects/:id/results', method: 'GET'},
    {path: '/projects', method : 'GET'},
    {path : '/projects/:id', method: 'DELETE'},
    {path: '/projects/:id', method : 'PUT'}
];