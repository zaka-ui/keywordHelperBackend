const {Result, Project} = require('../../models/Results');
const sequelize = require('../../config/config');
const resultRoutes = require('../../routes/resultRoutes');
const {auth} = require('../../middlewares/auth');
const { User } = require('../../models/User');



const setResultsRoute = (router) => {
    router.all('*', auth);   
    for(const route of resultRoutes){
        if (route.path === '/projects/:id/results' && route.method === 'POST'){
            router.post(route.path, createResult); 
        }
    }
}



const createResult = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const {id} = req.params; 
        const project = await Project.findOne({where : {id , UserId : req.user.id}});
        if (project === null || Object.values(project).length < 1) {
            return res.status(404).json({error : `project with id ${id} is not found`});
        } 
        const results = [];
        for (const result of req.body.results){
            const {keyword, keyword_difficulty, search_volume, suggestions } = result;
                const suggs = [];
                const newResult = await Result.create({
                    keyword,
                    keyword_difficulty,
                    search_volume,
                    ProjectId: id
                });
		if (newResult === null) {
			return res.status(500).json({error : "Couldn't register the resulst"});

		}
    		if (suggestions && suggestions.length > 0) {
		for (const suggestion of suggestions){
			console.log(suggestion);
			if(!suggestion.keyword) {
				throw new Error('suggestion are missing');
    			}
			suggs.push(await Result.create({
				keyword: suggestion.keyword,
                                keyword_difficulty : suggestion.keyword_difficulty,
                                search_volume : suggestion.search_volume,
                                ProjectId :id,
                                parent_id : newResult.id
    			}));
		}
			newResult.get()['suggestions'] = suggs;
		}
            results.push(newResult);
        }
        await t.commit();
        return res.json({results});
    } catch(err){
        await t.rollback();
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while creating the results.' });
    }

}





module.exports = setResultsRoute;


