# kaholo-plugin-gitlab-trigger
GitLab trigger plugin for Kaholo. The trigger have catch two webhooks:
- Push
- Merge Request

**Settings**

Secret - String

# Method: webhookPush

*Webhook URL:* *<<Kahoolo-URL>>*/webhook/gitlab/push

**Description**

This method catches the push webhook

**Parameters**

1. Secret - the secret string (to override settings)
2. Push branch - The branch name which was pushed to (ie. master, develop...) it can also be a substring.
3. Repo URL - the HTTP URl to the repository (when choosing to clone)

# Method: mrWebhook
  
*Webhook URL:* *<<Kahoolo-URL>>*/webhook/gitlab/mr

**Description**

This method catches the Merge Request webhook

**Parameters**

1. Secret - the secret string (to override settings)
2. To branch - The target branch (ie. master) it can also be a substring.
3. From branch - The source branch (ie. develop) it can also be a substring.
3. Repo URL - the HTTP URl to the repository (when choosing to clone)
