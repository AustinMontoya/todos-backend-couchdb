tar -czf ./app.tar.gz --exclude=node_modules/* app
packer build -force templates/app-ubuntu-14.04.3.json
