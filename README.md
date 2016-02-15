# Vue.js + Gulp 4.0 + Browserify + Wx  

## Installation
该项目基于vue.js框架，使用Gulp 4.0 + Browserify组合。因为是微信项目，所以使用了weui。

## Demo
案例代码可以参照 src/wx 目录。

### bash

安装项目依赖

```sh
npm install
```

项目初始化，如下示例，app 为需要开发的项目名称，放在 src 目录下面。

```sh
node init app 
```

开启服务

```sh
gulp watch 
```

生成项目静态文件,注意当前正处于哪个项目开发环境里面

```sh
gulp build
```

## gulp 4.0

```sh
# 如果安装过全局的 gulp 的话先卸载之
$ npm uninstall gulp -g

# 安装全局的 gulp 4.0
$ npm install "gulpjs/gulp#4.0" -g

# 到项目目录里删掉本地的 gulp
$ npm rm gulp --save-dev

# 安装本地的 gulp 4.0
$ npm install "gulpjs/gulp#4.0" --save-dev
```