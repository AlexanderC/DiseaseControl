DiseaseControl API
========

DiseaseControl is a disease control platform that facilitates end-to-end tracking of disease cases and resolutions keeping all nodes involved, starting from local level and growing up into a county wide level. This piece of software is originally designed to cover the needs of control software for Moldovan healthcare system for fighting against Coronavirus Covid-19. 

> The project started at [C19.md Initiative](https://c19.md/) [Hackaton](https://c19.md/hackathon) (March 2020).

Features:
--------

- [x] Milestone I
   - [x] Authentication and Authorization (RBAC)
   - [x] Add ability to onboard hospitals and groups them (2 level structure for now)
   - [x] Add ability to manage hospital “beds” and critical inventory (such as Lung Ventilation Systems, protective stuff, main medicine)
   - [x] Add ability to see available “beds” (e.g. for an ambulance) depending on the patient state and his needs.
- [ ] Milestone II
- [ ] Milestone III
- [ ] Milestone IV

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
cp .sample.env .docker.env # Adjust your configurations...
docker build -t dc-api .
```

> Check if the image is available by running `docker images`

Run services:

```bash
docker-compose up -d
```

> Check if services as up and running by using `docker ps`

Your application should have started on `0.0.0.0` at port `8000`.

Seed Data
-----

Run all database seeds:

```bash
npm run db:seeds:up
```

Drop all data seeded:

```bash
npm run db:seeds:down
```

Deploy
------

Deploy to a server you have SSH access given:

```bash
# Add DEPLOY_SEEDS=1 in case you need to run seeds, mainly on first deploy
# Add DEPLOY_SEEDS_RELOAD=1 if you want to re-run seeds (e.g. a new one added)
DEPLOY_SERVER_ROOT=/root/api DEPLOY_SERVER_DSN=root@139.59.159.64 ./bin/deploy.sh
```

> The server has to be set up as of section `Prerequisites` (except Git).

> NPM and Node needs to be set up using nvm, which is the only one supported for now =(

> If your database host is not resolving when `DEPLOY_SEEDS=1` or `DEPLOY_SEEDS_RELOAD=1` option added on deploy- add it to `/etc/hosts` (e.g. `127.0.0.1 database`).

Links
--------

- [Frontend Repository](https://github.com/AlexanderC/DiseaseControl-SPA)
- [Api Docs](http://localhost:8000/)
- [Product Vision](https://docs.google.com/document/d/15XOLQsRgfhh7dy5_gKIxMTNreHUQNgU5r3dOybIkKrw/edit)
- [Models EER Diagram](artifacts/models.png) 

TODO
----

- [ ] Move logic from controllers into services
- [ ] Implement Milestone II (see [Product Vision](https://docs.google.com/document/d/15XOLQsRgfhh7dy5_gKIxMTNreHUQNgU5r3dOybIkKrw/edit))
- [ ] Implement Milestone III (see [Product Vision](https://docs.google.com/document/d/15XOLQsRgfhh7dy5_gKIxMTNreHUQNgU5r3dOybIkKrw/edit))
- [ ] Implement Milestone IV (see [Product Vision](https://docs.google.com/document/d/15XOLQsRgfhh7dy5_gKIxMTNreHUQNgU5r3dOybIkKrw/edit))
