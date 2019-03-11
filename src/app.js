const mapExecutionService = require("../../../api/services/map-execution.service");
const Trigger = require("../../../api/models/map-trigger.model");
const config = require("./config");

function webhook(req,res){
    let payload = req.body;
    let repo = payload.repository.git_http_url;
    let branch = payload.ref.replace("refs/heads/", "");
    let secret = req.get('X-Gitlab-Token');
    let user = payload.user_name;

    return Trigger.find({ plugin: config.name }).then(function(triggers){
        triggers.forEach(trigger=>{
            const triggerRepoUrl = trigger.params.find(o => o.name === 'REPO').value;
            const triggerSecret = trigger.params.find(o => o.name === 'SECRET').value;
            const triggerBranch = trigger.params.find(o => o.name === 'BRANCH').value;

            if (triggerRepoUrl === repo && triggerSecret === secret && triggerBranch === branch){
                let message = `${trigger.name} Started by github trigger (push by ${user})`;
                mapExecutionService.execute(trigger.map, null, 0, req, trigger.configuration, message);
            }
        })
        res.send('OK');
    }).catch(err=>{
        res.send(err);
    })
}


module.exports = {
    webhook : webhook
}