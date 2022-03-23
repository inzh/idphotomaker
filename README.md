# idphotomaker

## 证件照制作工具
一个基于vue+vuex+vue-img-cutter+face-api.js+Face++Api+iview实现的web端证件照制作工具，实现自动矫正人脸，手动选择图片裁剪范围，自动抠出人脸并替换背景

## Demo
https://inzh.github.io/idphotomaker/

## Introduction
- iview构建ui
- vuex存储图片的base64，以便多个组件使用来展示图片
- localStorage存储vuex数据，防止刷新页面使得vuex数据丢失
- 使用`vue-img-cutter`实现图片手动裁剪，手动旋转等
> 详情查看：https://github.com/acccccccb/vue-img-cutter
- face-api.js实现人脸关键点检测，根据检测结果定位左眼和右眼，根据左眼和右眼的坐标，计算左右眼的两个坐标与X轴的角度，然后根据角度旋转图片实现人脸矫正
> 详情查看：https://github.com/justadudewhohacks/face-api.js
- 使用Face++ 提供的Api抠出人脸，并通过`canvas.drawImage`将抠出来的人脸绘在蓝/红/白背景的canvas上实现背景替换
> 一开始尝试使用Body-Pix（https://github.com/tensorflow/tfjs-models/tree/master/body-pix） 和 PaddleSeg（https://github.com/PaddlePaddle/PaddleSeg） 来实现人像抠图
经测试，效果明显不如Face++人体抠像和百度人像分割API，因此使用Face++Api实现人像分割


## Project setup
```
pnpm install
```

### Compiles and hot-reloads for development
```
pnpm run serve
```

### Compiles and minifies for production
```
pnpm run build
```

### Lints and fixes files
```
pnpm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
