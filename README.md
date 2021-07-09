# sian-admin

## Build Setup

```bash
# clone the project
git clone http://gitlab.sian.vip/sian/h5/sian-admin.git

# enter the project directory
cd sian-admin

# install dependency
npm install

# develop
npm run dev
```

This will automatically open [http://localhost:9530](http://localhost:9530)

## Build

```bash
# build for devlopment environment
npm run build:dev

# build for test environment
npm run build:test

# build for production environment
npm run build
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```
