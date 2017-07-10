node {
    def app
    stage('Clone repository') {
       
        checkout scm
    }
    stage('Build image for auth') {
       app = docker.build("fl0wz/microservices_for_auth","./auth/")
    }
    stage('Push image for auth') {
            docker.withRegistry('https://registry.hub.docker.com', 'flows_account') {
           
            app.push("${env.BUILD_NUMBER}")
           
            app.push("latest")
        }
    }
    
}

