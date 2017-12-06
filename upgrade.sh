curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
  "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:obdev/authentication_auth_flowz:dev","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3001:3001/tcp"],"version": "472d2d0a-f357-4dd7-9ecf-0daa7604ada9","environment": {"MONGODB": "mongodb://obdev2:123456789@ds133311.mlab.com:33311/closeoutpromo","SECRET": "abcdefgabcdefg"}}},"toServiceStrategy":null}' \
  'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s92?action=upgrade'

curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
  "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:obdev/authentication_ldap_flowz:dev","kind": "container","labels":{"io.rancher.container.pull_image": "always"},"ports": ["3000:3000/tcp"],"version": "fbcb0cf8-22f5-4134-baf9-55bc314f2f5a","environment": {"LDAPURL":"ldap://138.197.81.231:389","ADMINPASS":"123456","USERPASS":"123" }}},"toServiceStrategy":null}' \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s99?action=upgrade'

curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
  "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:obdev/authentication_user_flowz:dev","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3002:3002/tcp"],"version": "fbcb0cf8-22f5-4134-baf9-55bc314f2f5a","environment": {"MONGODB": "mongodb://obdev2:123456789@ds133311.mlab.com:33311/closeoutpromo","SECRET": "abcdefgabcdefg"}}},"toServiceStrategy":null}' \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s106?action=upgrade'
