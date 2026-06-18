pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Backend Setup') {
            steps {
                sh '''
                cd backend
                python3 -m venv venv
                . venv/bin/activate
                pip install -r requirements.txt
                '''
            }
        }

        stage('Frontend Setup') {
            steps {
                sh '''
                cd frontend
                npm install
                npm run build
                '''
            }
        }
    }
}
