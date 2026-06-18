pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        COMPOSE_PROJECT_NAME = "meridian"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend: Install & Test') {
            agent {
                docker { image 'python:3.12-slim'; args '-u root' }
            }
            steps {
                dir('backend') {
                    sh 'pip install --no-cache-dir -r requirements.txt'
                    sh 'pytest -q'
                }
            }
        }

        stage('Frontend: Install & Build') {
            agent {
                docker { image 'node:20-slim'; args '-u root' }
            }
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker: Build Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down --remove-orphans || true'
                sh 'docker compose up -d'
            }
        }

        stage('Smoke Test') {
            steps {
                sh 'sleep 8'
                sh 'curl -f http://localhost:5000/api/health'
                sh 'curl -f http://localhost:8090'
            }
        }
    }

    post {
        success {
            echo 'Meridian Coffee Catalog deployed: http://localhost:8090'
        }
        failure {
            sh 'docker compose logs --tail=80 || true'
        }
        always {
            sh 'docker compose ps || true'
        }
    }
}
