
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
            
                        sh ' npm run test' 
            }
         
    /* stage('Test'){
            steps { 
               
                    withSonarQubeEnv('sonar'){ 
                        sh 'npm run sonar' 
                    } 
                }}
         */
     
                      stage('publish') {
            steps {                     
                // Publish package to Nexus repository
                     withCredentials([file(credentialsId: 'nexus-cred', variable: 'mynpmrc')]) {
                         sh 'npm publish --userconfig $mynpmrc --loglevel verbose'
                         
                     }

                }
            }
        
   

// test sonarcloud
    }
}
