pipeline {
    agent any

   
      stages {
        stage('Checkout Git') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'jenkins-front-ssh', url: 'git@github.com:waelgharsalliii/Backend-PFE.git']])
            }
        }

        
        

        stage('Install NodeJs Dependencies') {
            steps {
                sh 'npm install' // or 'yarn install' if you're using yarn
            }
        }
    }
}
