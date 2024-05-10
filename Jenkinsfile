
 pipeline { 
    agent any 
    stages { 
        stage('Checkout Git') { 
            steps { 
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'jenkins-front-ssh', url: 'git@github.com:waelgharsalliii/Backend-PFE.git']]) 
            }
        }
        stage('sonarqube analysis') { 
            steps { 
                nodejs (nodeJSInstallationName: 'NodeJs'){ 
                    sh 'npm install' // or 'yarn install' if you're using yarn 
                    withSonarQubeEnv('sonar'){ 
                        sh ' npm run test' 
                        sh 'npm run sonar' 
                    }
                }
            }
        }
               stage('publish') {
                   steps {                     
   // Use the npmrc file directly without the --userconfig option
                withCredentials([file(credentialsId: 'npm-cred', variable: 'mynpmrc')]) {
                    // Copy the npmrc file to the workspace
                    sh 'cp $mynpmrc .npmrc'
                    // Publish using the copied npmrc file
                    sh 'npm publish --loglevel verbose'                     }
                  }
               }  
// test sonarcloud
    }
}
