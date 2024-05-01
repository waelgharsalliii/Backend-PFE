pipeline {
    agent any

    stages {
        stage('Checkout Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']],
                userRemoteConfigs: [[url: 'git@github.com:waelgharsalliii/Backend_PFE.git',
                                    credentialsId: 'Jenkins-git-ssh']]])                
            }
        }
  

        
        

        stage('Install NodeJs Dependencies') {
            steps {
                sh 'npm install' // or 'yarn install' if you're using yarn
            }
        }
    }
}
