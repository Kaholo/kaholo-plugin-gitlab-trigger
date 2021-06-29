const minimatch = require("minimatch")

function mrWebhook(req, res, settings, triggerControllers) {
    try {
        const body = req.body;
        if(!body.repository) {
            return res.status(400).send("Repository not found");
        }
        const reqUrl = body.project.http_url; //Gitlab Http URL
        const {target_branch: reqTarget, source_branch: reqSrc} = body.object_attributes; //Get source and target branch names
        const reqSecret = req.get('X-Gitlab-Token');

        triggerControllers.forEach((trigger) => {
            const { SECRET: trigSecret, TO_BRANCH: target, 
                    FROM_BRANCH: src, REPO_URL: repoUrl} = trigger.params;
            const secret = trigSecret || settings.SECRET;
    
            if (secret && reqSecret !== secret) return;
            if (target && !minimatch(reqTarget, target)) return;
            if (src && !minimatch(reqSrc, src)) return;
            if (repoUrl && !minimatch(reqUrl, repoUrl)) return;
            
            const msg = `${reqSrc}->${reqTarget} Merge Request`;
            trigger.execute(msg, body);
        });
        res.status(200).send("OK");
    }
    catch (err){
        res.status(422).send(err.toString());
    }
}

function webhookPush(req, res, settings, triggerControllers) {
    try {
        const body = req.body;
        if(!body.repository) {
            return res.status(400).send("Repository not found");
        }
        const reqUrl = body.repository.git_http_url; //Gitlab Http URL
        const reqBranch = body.ref.slice(11);
        const reqSecret = req.get('X-Gitlab-Token');

        triggerControllers.forEach((trigger) => {
            const { SECRET: trigSecret, PUSH_BRANCH: branch, REPO_URL: repoUrl } = trigger.params;
            const secret = trigSecret || settings.SECRET;

            if (secret && reqSecret !== secret) return;
            if (branch && !minimatch(reqBranch, branch)) return;
            if (repoUrl && !minimatch(reqUrl, repoUrl)) return;
            
            const msg = `${reqBranch} Branch Push`;
            trigger.execute(msg, body);
        });
        res.status(200).send("OK");
    }
    catch (err){
        res.status(422).send(err.toString());
    }
}

module.exports = {
    webhookPush,
    mrWebhook
}