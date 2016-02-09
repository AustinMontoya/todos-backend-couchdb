# Image Comparison

## Prerequisites

- [Packer](https://www.packer.io/intro/getting-started/setup.html)

### Digital Ocean

### Building the image

- Sign up for [Digital Ocean](https://www.digitalocean.com/) and generate an API token. (I put mine in `templates/do.token`, which is `.gitignore`d)

- Build the image

```shell
cd templates
packer build \
  -var "api_token=$(cat do.token)" \
  ubuntu-14.04.3-digital-ocean.json
```

### Logging into the image

- Install [tugboat](https://github.com/pearkes/tugboat):

```shell
gem install tugboat
tugboat authorize
```

- Create a droplet:

```shell
tugboat create packer-node-test -i packer-node -r nyc1
```

- Reset the password on the droplet through the Digital Ocean UI. This will shut down the instance and email you a new root password.


#### Todos

- Figure out ssh login password issue
- Why do you need to set the region again?
