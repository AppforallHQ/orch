WHAT IS ORCH?
=============

Why does `orch` exist, one might ask..

Almost everything we can do with orch is achievable via nginx. You can think of
orch as an "nginx on steroids". With orch, we have lesser need to tweak nginx
config on production servers. We wouldn't need to setup nginx on local dev
machines, and finally, changes made via orch are easily deployed to production
servers, compared to nginx configs.

Also, orch is an asset in our development environment. If we didn't have orch,
we were required to change local nginx config of each of our developers. We hate
to have endpoints like `http://PROJECT.ir:{8005,8006,8007,etc}`, so we put it
all behind `orch`. Morever, we can hide django admins behind orch like this:

1. In our django app (say `Site1`), we set the panel to
   `http://localhost:8006/admin/`, and serve public things like panel with
   `Site1` prefix, like this: `http://localhost:8006/Site1/dashboard`.

2. We'd configure `orch` (say port 3000) to proxy all paths with `/Site1` prefix
   to route to port 8006.

3. We'd serve port 3000 publicly, and reject remote connections to port 8006.

4. Admin panel is hidden from public access.

In conclusion, you can think of orch as a module which extracts some of our
tasks from sysadmin scope to developer scope, opening the gate of numerous npm
modules to our proxy server. Ideally, we can have sophisticated
logging/statistics modules, AB testing, load balancing and micro managing the
services via orch.


Deployment
==========

*   Install `git-deploy` on your local machine.

        gem install git-deploy

*   Add a remote to your local git clone

        git remote add host user@host.FQDN:/app/orch

*   Initiate remote git remote and deploy hooks on the remote server

        git deploy setup -r host

*   Push to remote

        git push host master:master

    > NOTE
    >
    > `orch`, as opposed to other apps which require a separate
    > branch for production and master (dev machine),
    > does not need a separate production branch.
    >
    > So we can safely push the master branch to remote

*   Do the one time setup. `ssh` to remote server and run

        ssh user@host.FQDN
        npm config set strict-ssl false
        cd /app/orch
        deploy/before_restart
        ./export_procfile
        sudo service orch start
