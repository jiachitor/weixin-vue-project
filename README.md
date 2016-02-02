# Vue.js demo 

### Building

# bash
```
npm install
```

#init
```
node install app   // 生产 app 项目的  gulpfile.js 文件
```

# watch:
```
gulp watch   
```

# build:
```
gulp build
```

### 开发环境
```
node server.js
```

### 生产环境
```
node server.js --production
```




##### gulp 4.0
```
# 如果安装过全局的 gulp 的话先卸载之
$ npm uninstall gulp -g

# 安装全局的 gulp 4.0
$ npm install "gulpjs/gulp#4.0" -g

# 到项目目录里删掉本地的 gulp
$ npm rm gulp --save-dev

# 安装本地的 gulp 4.0
$ npm install "gulpjs/gulp#4.0" --save-dev
```