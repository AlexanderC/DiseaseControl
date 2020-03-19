DiseaseControl API
========

DiseaseControl is a disease control platform that facilitates end-to-end tracking of disease cases and resolutions keeping all nodes involved, starting from local level and growing up into a county wide level. This piece of software is originally designed to cover the needs of control software for Moldovan healthcare system for fighting against Coronavirus Covid-19. 

Prerequisites
-----------

- [ ] Git
- [ ] Docker
- [ ] *NodeJS v12.x.x (for non docker usage)*

Installation
---------

Clone the project:

```bash
git clone https://github.com/AlexanderC/DiseaseControl.git
cd DiseaseControl
```

> If you do NOT run docker mode you need to install dependencies by yourself by running `npm install`

Configure environment:

```bash
cp sample.env .env
```

> You might want to edit `.env` to fill in your configuration

> For testing purpose you might omit this step. System will use `sample.env` as configuration file, which might be enough so far.

Non-Docker Usage
--------

Starting production server:

```bash
npm start
```

Monitoring production server:

```bash
npm run monitor
```

Starting development server:

```bash
npm run start:dev
```

Docker Usage
-----------

Build image:

```bash
docker build -t dc-api .
```

> Check if the image is available by running `docker images`

Run services:

```bash
# Run production ready setup w/ Nginx proxy and Let's Encrypt certificate
# You MUST set DEPLOY_HOSTNAME and DEPLOY_STAGE variables
# DEPLOY_STAGE="local" for self signed
# DEPLOY_STAGE="production" for Let's Encrypt certificate
# Add FORCE_RENEW='true' if you find your certificates are not chained correctly
DEPLOY_HOSTNAME=example.com DEPLOY_STAGE=local docker-compose up -d
# or, run plain API...
docker-compose up -d --scale https-api=0
```

> Check if services as up and running by using `docker ps`

Your application should have started on `0.0.0.0` at port `8000`.

Documentation
--------

- [Api Docs](http://localhost:8000/)
- [Product Vision](https://docs.google.com/document/d/15XOLQsRgfhh7dy5_gKIxMTNreHUQNgU5r3dOybIkKrw/edit)