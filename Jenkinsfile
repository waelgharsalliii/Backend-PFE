
pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from your repository
                checkout scm
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    // Build Docker images using Docker Compose
                    sh 'docker-compose -f $DOCKER_COMPOSE_FILE build'
                }
            }
        }


        stage('Run Docker Compose') {
            steps {
                script {
                    // Start containers using Docker Compose
                    sh 'docker-compose -f $DOCKER_COMPOSE_FILE up -d'
                }
            }
        }
    }}
 
