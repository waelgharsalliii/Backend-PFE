pipeline {
    agent any
        tools {nodejs "node"}{

    stages {
        stage('Checkout Git') {
            steps {
                  checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'jenkins-front-ssh', url: 'git@github.com:waelgharsalliii/Backend-PFE.git']])
              
            }
        }

        
        

        stage('sonarqube analysis') {
            steps {
                sh 'npm install' // or 'yarn install' if you're using yarn
                withSonarQubeEnivirment(sonar){
                    sh "npm install sonar-scanner"
                    sh "npm run sonar"
                }
                    
                }    
            }  

        }
    }
}
