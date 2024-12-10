const {Project, Result} = require('../../models/Results');
const projectRoutes = require('../../routes/projectRoutes');
const {auth} = require('../../middlewares/auth');
const { where } = require('sequelize');
const { find } = require('../../routes/resultRoutes');


const setProjectRoutes = (router) => {
    for (const route of projectRoutes) {
        if(route.method === "POST" &&  route.path === "/projects"){
            router.post(route.path, createProject);
        }
        if(route.path === '/projects/:id/results' && route.method === 'GET'){
            router.get(route.path, showProjectResults);
        }
        if(route.path === '/projects' && route.method === 'GET'){
            router.get(route.path, showProjects);
        }
        if (route.path === "/projects/:id" && route.method == "DELETE"){
            router.delete(route.path, deleteProject);
        }
        if (route.path === "/projects/:id" && route.method === "PUT"){
            router.put(route.path, updateProject);
        }
    }
};


const createProject = async (req, res) => {
    try {
        const {name,projectDomaineName, description} = req.body;
        console.log(projectDomaineName);
        
        if(!name || !description ) {
            return res.status(400).json({error: 'Missing fields name or description'});
        }
	const total_projects = await Project.count({ where: {UserId : req.user.id}});
	if (total_projects === 100) {
		return res.json({message :"you've reached the maximumprojects allowed"});
	}
        const newProject = await Project.create({
            name,
            projectDomaineName,
            description,
            UserId : req.user.id
        });

        if(newProject === null){
            return res.json({error : "Failed to create projecr"});
        }
        return res.json(newProject);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while creating the project' });
    }
}





const updateProject = async(req, res) => {
    const {id} = req.params;
    console.log(id);
    
    const {name, projectDomaineName , description , note} = req.body;
    console.log("req body" , req.body);
    
    const project = await Project.findByPk(id);
    if(project === null) {
        return res.status(404).json({error : 'project not found'});
    }
    if(!name && !description){
        return res.status(401).json({error: 'name or description are required'});        
    }
    project.name = name;
    project.description = description;
    project.projectDomaineName = projectDomaineName;
    project.note= note;

    const updateProject =await project.save();
    //console.log(updateProject);
    
    return res.json({message : "Done the project has been updated!" , project :updateProject})
}


const deleteProject = async(req, res) => {
    const {id} =  req.params;
    const project = await Project.findByPk(id);
    if(project === null) {
        return res.status(404).json({error : 'project not found'});
    }
    const results = await Result.findAll({where : {ProjectId : project.id}});
    for (const result of results){
        await result.destroy();
    }
    await project.destroy();
    res.json({message: "project has been deleted"});
}



const showProjectResults = async (req, res) => {
    const {id} =  req.params;
    const project = await Project.findByPk(id);
    if (project === null){
        return res.status(401).json({error : "Project not found"});
    }
    const results = await Result.findAll({where : {ProjectId: id}});
    let newRes = []
    for (const result of results){
        if(!result.parent_id){
            result.dataValues.suggestions = [];
            newRes.push(result);
        }else{
            const parent = newRes.find(r => r.id === result.parent_id);
            if (parent) {
                parent.dataValues.suggestions.push(result);
            }
        }
    }
    return res.json(newRes);
}





const showProjects = async(req, res) => {
    const limitStr = req.query.limit;
    const offsetStr = req.query.offset;
    const limit = parseInt(limitStr, 10) || 10;
    const offset = parseInt(offsetStr, 10) || 0;
    const {id} = req.user;
    const projetcs = await Project.findAll({where : {UserId :id}});
    return res.json(projetcs); 
}


module.exports = setProjectRoutes;

