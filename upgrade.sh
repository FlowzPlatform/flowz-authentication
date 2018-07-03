# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# -H 'Accept: application/json' \
# -H 'Content-Type: application/json' \
# -d '{
#   "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$DOCKER_USERNAME'/authentication_auth_flowz:'$DOCKER_IMAGE_TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3001:3001/tcp"],"version": "472d2d0a-f357-4dd7-9ecf-0daa7604ada9","environment": {"MONGODB": "mongodb://obdev2:123456789@ds125966-a0.mlab.com:25966/closeoutpromo","SECRET": "abcdefgabcdefg"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3001,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
# http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/$SERVICE_ID_AUTH?action=upgrade
#
# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# -H 'Accept: application/json' \
# -H 'Content-Type: application/json' \
# -d '{
#   "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$DOCKER_USERNAME'/authentication_ldap_flowz:'$DOCKER_IMAGE_TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3000:3000/tcp"],"version": "fbcb0cf8-22f5-4134-baf9-55bc314f2f5a","environment": {"LDAPURL":"ldap://openldap-authentication","ADMINPASS":"123456","USERPASS":"123" },"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3000,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
# 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s99?action=upgrade'
#
# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# -H 'Accept: application/json' \
# -H 'Content-Type: application/json' \
# -d '{
#   "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$DOCKER_USERNAME'/authentication_user_flowz:'$DOCKER_IMAGE_TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3002:3002/tcp"],"version": "fbcb0cf8-22f5-4134-baf9-55bc314f2f5a","environment": {"MONGODB": "mongodb://obdev2:123456789@ds125966-a0.mlab.com:25966/closeoutpromo","SECRET": "abcdefgabcdefg"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3002,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
# 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s106?action=upgrade'




if [ "$TRAVIS_BRANCH" = "master" ]
then
    {
    echo "call $TRAVIS_BRANCH branch"
    ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_MASTER":"$RANCHER_SECRETKEY_MASTER"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_MASTER/v2-beta/projects?name=Production" | jq '.data[].id' | tr -d '"'`
    echo $ENV_ID
    USERNAME="$DOCKER_USERNAME_FLOWZ";
    TAG="latest";
    MONGODB="$MONGODB_MASTER";
    SECRET="$SECRET_MASTER";
    DOMAINKEY="$DOMAINKEY_MASTER";
    RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_MASTER";
    RANCHER_SECRETKEY="$RANCHER_SECRETKEY_MASTER";
    RANCHER_URL="$RANCHER_URL_MASTER";
    accountSid="$accountSid_master";
    authToken="$authToken_master";
    no1="$no1_master";
    FROM="$FROM_master";
    no2="$no2_master";
   
    SERVICE_NAME_AUTH="$SERVICE_NAME_AUTH_MASTER";
    SERVICE_NAME_LDAP="$SERVICE_NAME_LDAP_MASTER";
    SERVICE_NAME_USER="$SERVICE_NAME_USER_MASTER";
    
    BACKEND_HOST="$BACKEND_HOST_MASTER";
  }
elif [ "$TRAVIS_BRANCH" = "develop" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_DEVELOP":"$RANCHER_SECRETKEY_DEVELOP"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_DEVELOP/v2-beta/projects?name=Develop" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="dev";
      MONGODB="$MONGODB_DEVELOP";
      SECRET="$SECRET_DEVELOP";
      DOMAINKEY="$DOMAINKEY_DEVELOP";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_DEVELOP";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_DEVELOP";
      RANCHER_URL="$RANCHER_URL_DEVELOP";
      accountSid="$accountSid_develop";
      authToken="$authToken_develop";
      no1="$no1_develop";
      FROM="$FROM_develop";
      no2="$no2_develop";
      
      SERVICE_NAME_AUTH="$SERVICE_NAME_AUTH_DEVELOP";
      SERVICE_NAME_LDAP="$SERVICE_NAME_LDAP_DEVELOP";
      SERVICE_NAME_USER="$SERVICE_NAME_USER_DEVELOP";
      
      BACKEND_HOST="$BACKEND_HOST_DEVELOP";
    }
elif [ "$TRAVIS_BRANCH" = "staging" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_STAGING":"$RANCHER_SECRETKEY_STAGING"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_STAGING/v2-beta/projects?name=Staging" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="staging";
      MONGODB="$MONGODB_STAGING";
      SECRET="$SECRET_STAGING";
      DOMAINKEY="$DOMAINKEY_STAGING";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_STAGING";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_STAGING";
      RANCHER_URL="$RANCHER_URL_STAGING";
      accountSid="$accountSid_staging";
      authToken="$authToken_staging";
      no1="$no1_staging";
      FROM="$FROM_staging";
      no2="$no2_staging";
      SERVICE_NAME_AUTH="$SERVICE_NAME_AUTH_STAGING";
      SERVICE_NAME_LDAP="$SERVICE_NAME_LDAP_STAGING";
      SERVICE_NAME_USER="$SERVICE_NAME_USER_STAGING";
      
      BACKEND_HOST="$BACKEND_HOST_STAGING";

    }    
else
  {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_QA":"$RANCHER_SECRETKEY_QA"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_QA/v2-beta/projects?name=Develop" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="qa";
      MONGODB="$MONGODB_QA";
      SECRET="$SECRET_QA";
      DOMAINKEY="$DOMAINKEY_QA";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_QA";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_QA";
      RANCHER_URL="$RANCHER_URL_QA";
      accountSid="$accountSid_qa";
      authToken="$authToken_qa";
      no1="$no1_qa";
      FROM="$FROM_qa";
      no2="$no2_qa";
      SERVICE_NAME_AUTH="$SERVICE_NAME_AUTH_QA";
      SERVICE_NAME_LDAP="$SERVICE_NAME_LDAP_QA";
      SERVICE_NAME_USER="$SERVICE_NAME_USER_QA";
      
      BACKEND_HOST="$BACKEND_HOST_QA";
  }
fi

SERVICE_ID_AUTH=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME_AUTH" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_AUTH

SERVICE_ID_LDAP=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME_LDAP" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_LDAP

SERVICE_ID_USER=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME_USER" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_USER

curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
  "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/authentication_auth_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "'"$BACKEND_HOST"'"},"ports": ["3001:3001/tcp"],"environment": {"MONGODB": "'"$MONGODB"'","SECRET": "'"$SECRET"'","DOMAINKEY":"'"$DOMAINKEY"'","accountSid":"'"$accountSid"'","authToken":"'"$authToken"'","no1":"'"$no1"'","FROM":"'"$FROM"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3001,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_AUTH?action=upgrade

curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
  "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/authentication_ldap_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "'"$BACKEND_HOST"'"},"ports": ["3000:3000/tcp"],"environment": {"LDAPURL":"'"$LDAPURL"'","ADMINPASS":"'"$ADMINPASS"'","USERPASS":"'"$USERPASS"'" },"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3000,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_LDAP?action=upgrade

curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
  "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/authentication_user_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "'"$BACKEND_HOST"'"},"ports": ["3002:3002/tcp"],"environment": {"MONGODB": "'"$MONGODB"'","SECRET": "'"$SECRET"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3002,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_USER?action=upgrade
