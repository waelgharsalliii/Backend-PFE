
 pipeline { 
    agent any 
    stages { 
        stage('Checkout Git') { 
            steps { 
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'jenkins-front-ssh', url: 'git@github.com:waelgharsalliii/Backend-PFE.git']]) 
            }
        }
     stage('build') { 
         steps{
            
                nodejs (nodeJSInstallationName: 'NodeJs'){ 
                    sh 'npm install' // or 'yarn install' if you're using yarn 
                }}}
     
    stage('Test'){
          steps{
             nodejs(nodeJSInstallationName: 'NodeJs') {
            
                   sh 'npm run test' 
            }
    }}
         
  stage('Sonarqube'){
    steps { 
              nodejs (nodeJSInstallationName: 'NodeJs'){     
                    withSonarQubeEnv('sonar'){ 
                        sh 'npm run sonar' 
                    } 
                }
                      } 
  }
           stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t waelgharsalli/backend-pfe .'
                }
            }
        }
     stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', passwordVariable: 'wael01234', usernameVariable: 'waelggharsalli')]) {
                        sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin'
                    }
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    sh 'docker push waelgharsalli/backend-pfe:latest'
                }
            }
        }
         
     
                      stage('publish') {
            steps {                     
                // Publish package to Nexus repository
                     withCredentials([file(credentialsId: 'nexus-cred', variable: 'mynpmrc')]) {

                         sh "npm publish --userconfig $mynpmrc --loglevel verbose"

                         
                     }

                }
            }
        
   

// test sonarcloud///////////////
    }
}
