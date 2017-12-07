curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s92?action=finishupgrade'

curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s99?action=finishupgrade'

curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s106?action=finishupgrade'
