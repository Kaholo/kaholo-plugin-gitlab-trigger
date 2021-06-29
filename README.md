# kaholo-plugin-gitlab-trigger
GitLab trigger plugin for Kaholo. The trigger have catch two webhooks:
- Push
- Merge Request

## Settings
1. Secret (Vault) **Optional** - Default secret to use to check in webhooks.

## How To Use
After installing this trigger on your Kaholo Server, make sure you have a webhook configured on your GitLab Repository.
You can see how to do it in [here](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html).

## Method: webhookPush

*Webhook URL:* *\<Kahoolo-URL\>*/webhook/gitlab/push

**Description**

This method catches the push webhook

**Parameters**

1. Secret (Vault) **Optional** - If provided, check secret in webhook matches.
2. Push Branch (String) **Optional** - The name or name [minimatch pattern](https://github.com/isaacs/minimatch#readme) of the branches to catch with this webhook.
3. Repo URL (String) **Optional** - The URL or it's [minimatch pattern](https://github.com/isaacs/minimatch#readme), of the repositories to catch in the webhook.

## Method: mrWebhook
  
*Webhook URL:* *\<Kahoolo-URL\>*/webhook/gitlab/mr

**Description**

This method catches the Merge Request webhook

**Parameters**

1. Secret (Vault) **Optional** - If provided, check secret in webhook matches.
2. To Branch (String) **Optional** - The name or name [minimatch pattern](https://github.com/isaacs/minimatch#readme) of the target branches to catch with this webhook.
3. From Branch (String) **Optional** - The name or name [minimatch pattern](https://github.com/isaacs/minimatch#readme) of the source branches to catch with this webhook.
4. Repo URL (String) **Optional** - The URL or it's [minimatch pattern](https://github.com/isaacs/minimatch#readme), of the repositories to catch in the webhook.
