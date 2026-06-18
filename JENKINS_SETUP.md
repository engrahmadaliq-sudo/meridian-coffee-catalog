# Setting Up Jenkins + Docker for This Project (Local Machine)

This walks through getting Jenkins running locally, connected to your Docker
engine, and wired to run the `Jenkinsfile` in this repo automatically.

## 0. Prerequisites

- **Docker Desktop** (or Docker Engine) installed and **running**
- **Git** installed
- This project committed to a Git repo. If you haven't done that yet:
  ```bash
  cd meridian-coffee-catalog
  git init
  git add .
  git commit -m "Initial commit: Meridian coffee catalog"
  ```
  Jenkins can pull from a local path or from GitHub/GitLab — either works for
  the steps below. If you want automatic builds on push, push this to GitHub
  first.

## 1. Run Jenkins itself in a container

Because the pipeline needs to run `docker compose` commands, Jenkins needs
access to your machine's Docker engine. The simplest way is "Docker outside
of Docker": run Jenkins as a container, but mount the host's Docker socket
into it so Jenkins controls the *same* Docker engine your laptop uses (rather
than a nested, isolated one).

**macOS / Linux:**
```bash
docker run -d --name jenkins \
  -p 8081:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(which docker)":/usr/bin/docker \
  --group-add $(stat -c '%g' /var/run/docker.sock) \
  jenkins/jenkins:lts
```

**Windows (using WSL2 + Docker Desktop, recommended):** run the same command
from inside your WSL2 terminal — Docker Desktop's WSL integration exposes
`/var/run/docker.sock` there.

Notes:
- We use port **8081** for Jenkins (not 8080) because the frontend container
  in this project already uses port 8080.
- `jenkins_home` is a named volume so Jenkins' config/jobs survive restarts.

## 2. Unlock Jenkins and install plugins

1. Get the initial admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
2. Open **http://localhost:8081** and paste it in.
3. Choose **"Install suggested plugins"**.
4. Once that finishes, go to **Manage Jenkins → Plugins → Available plugins**
   and make sure these are installed (search and install if missing):
   - **Docker Pipeline** (lets `agent { docker { image '...' } }` work in the Jenkinsfile)
   - **Git** (usually already included in the suggested set)
5. Create your admin user when prompted.

## 3. Create the pipeline job

1. From the Jenkins dashboard, click **New Item**.
2. Name it `meridian-coffee-catalog`, choose **Pipeline**, click OK.
3. Under **Pipeline**, set **Definition** to **"Pipeline script from SCM"**.
4. Set **SCM** to **Git**.
5. **Repository URL**:
   - If you pushed to GitHub: paste the HTTPS or SSH URL.
   - If you're keeping it fully local: you can point at a local path using
     `file:///path/to/meridian-coffee-catalog` (this works because the
     Jenkins container can see your filesystem if you also mount your repo
     directory — add `-v /path/to/meridian-coffee-catalog:/repo` to the
     `docker run` command above and use `file:///repo`).
6. **Script Path**: `Jenkinsfile` (default, no change needed).
7. Save.

## 4. Run it

Click **Build Now**. Click into the build number → **Console Output** to
watch it move through: Checkout → Backend tests → Frontend build → Docker
build → Deploy → Smoke test.

When it finishes successfully, visit **http://localhost:8080** to see the
live app, deployed entirely through the pipeline.

## Troubleshooting

- **`permission denied` on `/var/run/docker.sock`**: the `--group-add` flag
  in step 1 should handle this, but if it still fails, run
  `docker exec -u root jenkins chmod 666 /var/run/docker.sock` as a quick
  fix (not ideal for production, fine for a local learning setup).
- **`docker: command not found` inside Jenkins**: double-check the
  `-v "$(which docker)":/usr/bin/docker` mount path matches where Docker is
  actually installed on your host.
- **Port already in use**: if 8080 or 8081 are taken by something else,
  change the left-hand side of the `-p` flags (e.g. `-p 9090:8080`) and
  adjust the URLs you visit accordingly.
- **Docker Desktop not running**: since Jenkins shares your host's Docker
  engine, Docker Desktop must be running *before* you start the Jenkins
  container, and must stay running for builds to succeed.
- **Stale containers after a failed build**: run `docker compose down` and
  `docker compose ps` from your project folder to check state directly.

## Going further

- Add a **GitHub webhook** + "GitHub hook trigger for GITScm polling" in the
  job config to auto-build on every push.
- Add a Slack/email notification step in the `post` block of the
  `Jenkinsfile`.
- Swap SQLite for Postgres by adding a `db` service to `docker-compose.yml`
  once you outgrow a single-file database.
