const mapExecutionService = require("../../../api/services/map-execution.service");
const Trigger = require("../../../api/models/map-trigger.model");
const config = require("./config");
const minimatch = require("minimatch")

function findTriggers(body, validatationFn, startParams, req, res){
    Trigger.find({ plugin: config.name }).then((triggers) => {
        console.log(`Found ${triggers.length} triggers`);
        res.send('OK');
        triggers.forEach(trigger=>{  
            validatationFn(trigger,startParams)
            .then(exec(trigger, body, req.io))
            .catch(console.error);
        });
    }).catch((error) => res.send(error))
}

function exec(trigger, body, io){
    return ()=>{
        console.log(trigger.map);
        let message = trigger.name + ' - Started by Gitlab trigger';
        console.log(`******** Gitlab: executing map ${trigger.map} ********`);
        mapExecutionService.execute(trigger.map, null, io, {config : trigger.configuration, agents: []}, message, body);
    }
}


function controllerfunctionMR (req, res) {
    let body = req.body;
    
    if(!body.repository) {
        console.log('Repo not found')
        return res.send('repo not found')
    }
    
    let repositoryURL = body.project.http_url //Gitlab HttpURL
    let targetBranch = body.object_attributes.target_branch; //Get target branch name
    let sourceBranch = body.object_attributes.source_branch; //Get source branch name
    
    let secret = req.get('X-Gitlab-Token');

    findTriggers(body, validateTriggerPR, {repositoryURL, targetBranch, sourceBranch, secret},req, res);
}


function validateTriggerPR(trigger, {repositoryURL, targetBranch, sourceBranch, secret}){
    return new Promise((resolve, reject) => {
        
        const triggerRepoUrl = trigger.params.find(o => o.name === 'REPO_URL');
        const toBranch = trigger.params.find(o => o.name === 'TO_BRANCH');
        const fromBranch = trigger.params.find(o => o.name === 'FROM_BRANCH');
        const triggerSecret = trigger.params.find(o => o.name === 'SECRET');
        /**
         * Check if the Repo URL is provided (else consider as ANY)
         * Check that the Repo URL is the same as provided by the Trigger and if not provided 
        */
        if (triggerRepoUrl.value && repositoryURL !== triggerRepoUrl.value) {
            return reject("Not same repo");
        }

        /**
         * Check that To branch provided - else - consider as any.
         */
        if (toBranch.value &&  !minimatch(targetBranch, toBranch.value)) {
                return reject("Not matching target branch")
        }

        /**
         * Check that From branch provided - else - consider as any.
         */
        if (fromBranch.value &&  !minimatch(sourceBranch, fromBranch.value)) {
            return reject("Not matching target branch")
        }

        if (triggerSecret.value && secret !== triggerSecret.value) {
            return reject("Not same secret");
        }
        return resolve();
    })
}

function controllerfunctionPush(req,res){
    let push = req.body;
    
    if(!push.repository) {
        console.log('Repo not found')
        return res.send('repo not found')
    }
    
    let repositoryURL = push.repository.git_http_url
    let pushBranch = push.ref.slice(11); //Get target branch name
    
    let secret = req.get('X-Gitlab-Token');
    findTriggers(push, validateTriggerPush, {repositoryURL, pushBranch, secret},req, res);
}

function validateTriggerPush(trigger, {repositoryURL, pushBranch, secret}){
    return new Promise((resolve, reject) => {
        const triggerRepoUrl = trigger.params.find(o => o.name === 'REPO_URL');
        const triggerPushBranch = trigger.params.find(o => o.name === 'PUSH_BRANCH');
        const triggerSecret = trigger.params.find(o => o.name === 'SECRET');
        /**
         * Check if the Repo URL is provided (else consider as ANY)
         * Check that the Repo URL is the same as provided by the Trigger and if not provided 
        */
        if (triggerRepoUrl.value && repositoryURL !== triggerRepoUrl.value) {
            return reject("Not same repo");
        }

        /**
         * Check that To branch provided - else - consider as any.
         */
         if (triggerPushBranch.value && !minimatch(pushBranch, triggerPushBranch.value)) {
                return reject("Not matching pushed branch")
        }

        if (triggerSecret.value && secret !== triggerSecret.value) {
            return reject("Not same secret");
        }

        return resolve();
    });
}

module.exports = {
    webhookPush : controllerfunctionPush,
    mrWebhook : controllerfunctionMR
}