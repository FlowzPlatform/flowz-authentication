# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s92?action=finishupgrade'
#
# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s99?action=finishupgrade'
#
# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s106?action=finishupgrade'



if [ "$TRAVIS_BRANCH" = "master" ]
then
    {
    echo "call $TRAVIS_BRANCH branch"
    ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=Production" | jq '.data[].id' | tr -d '"'`
    echo $ENV_ID
    USERNAME="$DOCKER_USERNAME_FLOWZ";
    TAG="latest";
  }
elif [ "$TRAVIS_BRANCH" = "develop" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=Develop" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="dev";
    }
elif [ "$TRAVIS_BRANCH" = "staging" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=Staging" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="staging";
    }    
else
  {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=QA" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="qa";
  }
fi

SERVICE_ID_AUTH=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services?name=auth-authentication-flowz" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_AUTH

SERVICE_ID_LDAP=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services?name=ldap-authentication-flowz" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_LDAP

SERVICE_ID_USER=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services?name=user-authentication-flowz" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_USER

echo "waiting for service to upgrade "
    while true; do

      case `curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
          -X GET \
          -H 'Accept: application/json' \
          -H 'Content-Type: application/json' \
          "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_AUTH/" | jq '.state'` in
          "\"upgraded\"" )
              echo "completing service upgrade"
              curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
                -X POST \
                -H 'Accept: application/json' \
                -H 'Content-Type: application/json' \
                "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_AUTH?action=finishupgrade"
              break ;;
          "\"upgrading\"" )
              echo "still upgrading"
              echo -n "."
              sleep 60
              continue ;;
          *)
              die "unexpected upgrade state" ;;
      esac
    done


    echo "waiting for service to upgrade "
        while true; do

          case `curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
              -X GET \
              -H 'Accept: application/json' \
              -H 'Content-Type: application/json' \
              "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_LDAP/" | jq '.state'` in
              "\"upgraded\"" )
                  echo "completing service upgrade"
                  curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
                    -X POST \
                    -H 'Accept: application/json' \
                    -H 'Content-Type: application/json' \
                    "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_LDAP?action=finishupgrade"
                  break ;;
              "\"upgrading\"" )
                  echo "still upgrading"
                  echo -n "."
                  sleep 60
                  continue ;;
              *)
                  die "unexpected upgrade state" ;;
          esac
        done

        echo "waiting for service to upgrade "
            while true; do

              case `curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
                  -X GET \
                  -H 'Accept: application/json' \
                  -H 'Content-Type: application/json' \
                  "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_USER/" | jq '.state'` in
                  "\"upgraded\"" )
                      echo "completing service upgrade"
                      curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
                        -X POST \
                        -H 'Accept: application/json' \
                        -H 'Content-Type: application/json' \
                        "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_USER?action=finishupgrade"
                      break ;;
                  "\"upgrading\"" )
                      echo "still upgrading"
                      echo -n "."
                      sleep 60
                      continue ;;
                  *)
                      die "unexpected upgrade state" ;;
              esac
            done
