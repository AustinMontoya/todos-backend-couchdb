
# See https://github.com/mitchellh/packer/issues/901
if [[ $(uname) == 'Darwin' ]]; then
  echo "Setting up workaround for packer's docker builder on OSX"
  [ ! -d "$HOME/tmp" ] &&  mkdir $HOME/tmp
  TMPDIR=$HOME/tmp
fi

tar -czf ./app.tar.gz --exclude=node_modules/* app
packer build -force templates/app-$1.json
