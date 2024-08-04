
 pipeline { 
    agent any 
    
    parameters {
       string(name: 'local', defaultValue: "local", description: 'Git branch name')
       string(name: 'prod', defaultValue: 'prod', description: 'Git change ID for merge requests')

  }
    stages { 
   when {
        expression {
            (params.local == local) }
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
     
      /* stage('Test'){
          steps{
            
                        sh 'npm run test' 
            }
    }*/
         
  stage('Test'){
    steps { 
              nodejs (nodeJSInstallationName: 'NodeJs'){     
                    withSonarQubeEnv('sonar'){ 
                        sh 'npm run sonar' 
                    } 
                }
                      } 
  }
                      
         
     
                      stage('publish') {
            steps {                     
                // Publish package to Nexus repository
                     withCredentials([file(credentialsId: 'nexus-cred', variable: 'mynpmrc')]) {
<<<<<<< HEAD
                         sh "npm publish --userconfig $mynpmrc --loglevel verbose"
=======
                         sh 'npm publish --userconfig $mynpmrc --loglevel verbose'
>>>>>>> aba77eccf48046501e1d87b92ee3e1815dd4282c
                         
                     }

                }
            }
        
   

// test sonarcloud
    }
}
