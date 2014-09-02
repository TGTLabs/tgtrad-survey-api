tgtrad-survey-shared
====================

Shared modules for tgtrad-survey projects

This is a project that should not be directly modified.  Instead modify one of the subprojects that is using this rep.

This repo was created as a bare repository
http://www.gitguys.com/topics/shared-repositories-should-be-bare-repositories/

Work Flow
---
1. Make changes to shared directory
2. Commit those changes locally
3. Follow steps below to push changes to shared subtree BEFORE pushing to origin master
4. Then push to origin master
5. On other repos that require the shared folder pull down the changes and push the new ref to origin master

Usages
---

adding to your repository
 - git remote add shared <repo url> 
 - git subtree add --prefix=shared --squash shared master
 
grabbing latest changes
 - git subtree pull --prefix=shared --squash shared master

making changes
 - If you DO NOT have a branch for the subtree
   - git subtree split --prefix=shared --branch shared

 - If you do have the branch:
    - git subtree split --prefix=shared --onto shared --branch shared

 git push shared shared:master


Resources
---
http://blog.charlescy.com/blog/2013/08/17/git-subtree-tutorial/
