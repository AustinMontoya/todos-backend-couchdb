BUILD_TYPE=$1

# TODO: fetch runtime version based on app's package.json
APP_NODE_VERSION='v5.5.0'

# See https://github.com/mitchellh/packer/issues/901
if [[ $(uname) == 'Darwin' ]]; then
  echo "Setting up workaround for packer's docker builder on OSX"
  [ ! -d "$HOME/tmp" ] &&  mkdir $HOME/tmp
  TMPDIR=$HOME/tmp
fi

if [[ $BUILD_TYPE == 'vbox-nano' ]]; then
  echo "fetching runtime..."
  curl https://nodejs.org/dist/v5.5.0/win-x64/node.exe -o node.exe
  mv node.exe app/

  echo "compressing app..."
  rm app.zip
  powershell.exe -nologo -noprofile -command "& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::CreateFromDirectory('app', 'app.zip'); }"

  echo "cleaning up runtime..."
  rm app/node.exe
else
  echo "compressing app..."
  tar -czf ./app.tar.gz --exclude=node_modules/* app
fi

WINRMCP_DEBUG=1 PACKER_LOG=1 $GOPATH/bin/packer build -force templates/app-$BUILD_TYPE.json
