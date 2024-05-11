
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
        // Publish package to Nexus repository
        withCredentials([file(credentialsId: 'npm-cred', variable: 'npmAuthTokenFile')]) {
            sh '''
                   echo "//${'http://192.168.1.206:8081/repository/npm-hosted-repository/'}:_authToken=$(cat ${npmAuthTokenFile})" > .npmrc
                   npm publish --loglevel verbose
              '''
        }
              }
                  }
                
// test sonarcloud
    }
}
