
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
                         sh "npm publish --userconfig $npmAuthTokenFile --loglevel verbose"
                         
                     }

                }
            }
        
   

// test sonarcloud
    }
}
