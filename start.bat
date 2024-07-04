@echo off
docker-compose -f docker-compose.external.yml up -d
echo YT-DLP WebUI is now running!
echo Access the application at http://localhost:3000