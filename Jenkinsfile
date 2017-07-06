node {
    def app,app1
    stage('Clone repository') {
       
        checkout scm
    }
    stage('Build image for auth') {
       app = docker.build("80017/microservices_for_auth","./auth/")
    }
    stage('Push image for auth') {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
           
            app.push("${env.BUILD_NUMBER}")
           
            app.push("latest")
        }
    }
    stage('Build image for user') {
       app1 = docker.build("80017/microservices_for_user","./user/")
    }
    stage('Push image for user') {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
        
            app1.push("${env.BUILD_NUMBER}")
           
            app1.push("latest")
        }
    }
}
