# 路由

# Contents
- [数据查询&研判工具-同行地图](#数据查询&研判工具-同行地图)
  - [IMSI同行地图](#imsi同行地图)
  - [IMEI同行地图](#imei同行地图)
  - [MAC同行地图](#mac同行地图)
- [数据查询-轨迹地图](#数据查询-轨迹地图)
  - [IMSI轨迹地图](#imsi轨迹地图)
  - [IMSI轨迹地图地点模式](#imsi轨迹地图地点模式)
  - [IMEI轨迹地图](#imei轨迹地图)
  - [IMEI轨迹地图地点模式](#imei轨迹地图地点模式)
  - [MAC轨迹地图](#mac轨迹地图)
  - [MAC轨迹地图地点模式](#mac轨迹地图地点模式)
  - [Car轨迹地图](#car轨迹地图)
<<<<<<< HEAD
  - [Face轨迹地图](#face轨迹地图)
=======
  - [Car轨迹地图地点模式](#car轨迹地图地点模式)
  - [Face轨迹地图](#face轨迹地图)
  - [Face轨迹地图地点模式](#face轨迹地图地点模式)
>>>>>>> cpip2.0
- [数据查询-关联地图](#数据查询-关联地图)
  - [IMSI关联MAC地图](#imsi关联mac地图)
  - [IMSI关联Car地图](#imsi关联car地图)
  - [MAC关联IMSI地图](#mac关联imsi地图)
  - [MAC关联Car地图](#mac关联car地图)
  - [Car关联IMSI地图](#car关联imsi地图)
  - [Car关联MAC地图](#car关联mac地图)
  - [Face关联IMSI地图](#face关联imsi地图)
  - [Face关联MAC地图](#face关联mac地图)
- [研判工具-碰撞地图](#研判工具-碰撞地图)
  - [IMSI碰撞地图](#imsi碰撞地图)
  - [MAC碰撞地图](#mac碰撞地图)
- [研判工具-关联地图](#研判工具-关联地图)
  - [IMSI关联MAC地图](#imsi关联mac地图-1)
  - [IMSI关联Car地图](#imsi关联car地图-1)
  - [MAC关联IMSI地图](#mac关联imsi地图-1)
  - [MAC关联Car地图](#mac关联car地图-1)
  - [Car关联IMSI地图](#car关联imsi地图-1)
  - [Car关联MAC地图](#car关联mac地图-1)
- [研判工具-集合运算](#研判工具-集合运算)
  - [IMSI集合运算](#imsi集合运算)
  - [MAC集合运算](#mac集合运算)
  - [Car集合运算](#car集合运算)

## 数据查询&研判工具-同行地图

### IMSI同行地图

```javascript
  {
    path: 'map/imsi/together'
    name: 'IMSITogetherMap'
    props: {
      key: String,
      imsis: Array.join(',')
    }
  }
```

### IMEI同行地图

```javascript
  {
    path: 'map/imsi/together'
    name: 'IMSITogetherMap'
    props: {
      key: String,
      imsis: Array.join(',')
    }
  }
```

### MAC同行地图

```javascript
  {
    path: 'map/mac/together'
    name: 'MACTogetherMap'
    props: {
      key: String,
      macs: Array.join(',')
    }
  }
```

## 数据查询-轨迹地图

### IMSI轨迹地图

```javascript
  {
    path: 'map/search/imsi/trail'
    name: 'DataSearchIMSITrailMap'
    props: {
      key: String,
      imsis: JSON.stringify()
    }
  }
```

### IMSI轨迹地图地点模式

```javascript
  {
    path: 'map/search/imsi/trail/place'
    name: 'DataSearchIMSITrailPlaceMap'
    props: {
      key: String
    }
  }
```

### IMEI轨迹地图

```javascript
  {
    path: 'map/search/imei/trail'
    name: 'DataSearchIMEITrailMap'
    props: {
      key: String,
      imeis: JSON.stringify()
    }
  }
```

### IMEI轨迹地图地点模式

```javascript
  {
    path: 'map/search/imei/trail/place'
    name: 'DataSearchIMEITrailPlaceMap'
    props: {
      key: String
    }
  }
```

### MAC轨迹地图

```javascript
  {
    path: 'map/search/mac/trail'
    name: 'DataSearchMACTrailMap'
    props: {
      key: String,
      macs: JSON.stringify()
    }
  }
```

### MAC轨迹地图地点模式

```javascript
  {
    path: 'map/search/mac/trail/place'
    name: 'DataSearchMACTrailPlaceMap'
    props: {
      key: String
    }
  }
```

### Car轨迹地图

```javascript
  {
    path: 'map/search/car/trail'
    name: 'DataSearchCarTrailMap'
    props: {
      key: String,
      cars: JSON.stringify()
    }
  }
```

<<<<<<< HEAD
=======
### Car轨迹地图地点模式

```javascript
  {
    path: 'map/search/car/trail/place'
    name: 'DataSearchCarTrailPlaceMap'
    props: {
      key: String,
      cars: JSON.stringify()
    }
  }
```

>>>>>>> cpip2.0
### Face轨迹地图

```javascript
  {
    path: 'map/search/face/trail'
    name: 'DataSearchFaceTrailMap'
    props: {
      key: String,
      faces: JSON.stringify()
    }
  }
```

<<<<<<< HEAD
=======
### Face轨迹地图地点模式

```javascript
  {
    path: 'map/search/face/trail/place'
    name: 'DataSearchFaceTrailPlaceMap'
    props: {
      key: String,
      devices: JSON.stringify()
    }
  }
```

>>>>>>> cpip2.0
## 数据查询-关联地图

### IMSI关联MAC地图

```javascript
  {
    path: 'map/search/imsi/join/mac',
    name: 'DataSearchIMSIJoinMACMap',
    props: {
      key: String,
      macs: JSON.stringify()
    }
  }
```

### IMSI关联Car地图

```javascript
  {
    path: 'map/search/imsi/join/car',
    name: 'DataSearchIMSIJoinCarMap',
    props: {
      key: String,
      cars: JSON.stringify()
    }
  }
```

### MAC关联IMSI地图

```javascript
  {
    path: 'map/search/mac/join/imsi',
    name: 'DataSearchMACJoinIMSIMap',
    props: {
      key: String,
      imsis: JSON.stringify()
    }
  }
```

### MAC关联Car地图

```javascript
  {
    path: 'map/search/mac/join/car',
    name: 'DataSearchMACJoinCarMap',
    props: {
      key: String,
      cars: JSON.stringify()
    }
  }
```

### Car关联IMSI地图

```javascript
  {
    path: 'map/search/car/join/imsi',
    name: 'DataSearchCarJoinIMSIMap',
    props: {
      key: String,
      imsis: JSON.stringify()
    }
  }
```

### Car关联MAC地图

```javascript
  {
    path: 'map/search/car/join/mac',
    name: 'DataSearchCarJoinMACMap',
    props: {
      key: String,
      macs: JSON.stringify()
    }
  }
```

### Face关联IMSI地图

```javascript
{
  path: 'map/search/face/join/imsi',
  name: 'DataSearchFaceJoinIMSIMap',
  props: {
    key: String,
    imsis: JSON.stringify()
  }
}
```

### Face关联MAC地图

```javascript
{
  path: 'map/search/face/join/mac',
  name: 'DataSearchFaceJoinMACMap',
  props: {
    key: String,
    macs: JSON.stringify()
  }
}
```

## 研判工具-碰撞地图

### IMSI碰撞地图

```javascript
  {
    path: 'map/analyze/imsi/collision',
    name: 'AnalyzeToolIMSICollisionMap',
    props: {
      key: String,
      imsis: Array.join(',')
    }
  }
```

### MAC碰撞地图

```javascript
  {
    path: 'map/analyze/mac/collision',
    name: 'AnalyzeToolMACCollisionMap',
    props: {
      key: String,
      macs: Array.join(',')
    }
  }
```

## 研判工具-关联地图

### IMSI关联MAC地图

```javascript
  {
    path: 'map/analyze/imsi/join/mac',
    name: 'AnalyzeToolIMSIJoinMACMap',
    props: {
      key: String,
      macs: Array.join(','),
      imsi: String,
      imei: String,
      areas: JSON.stringify(),
      time: Number
    }
  }
```

### IMSI关联Car地图

```javascript
  {
    path: 'map/analyze/imsi/join/car',
    name: 'AnalyzeToolIMSIJoinCarMap',
    props: {
      key: String,
      cars: Array.join(','),
      imsi: String,
      imei: String,
      areas: JSON.stringify(),
      time: Number
    }
  }
```

### MAC关联IMSI地图

```javascript
  {
    path: 'map/analyze/mac/join/imsi',
    name: 'AnalyzeToolMACJoinIMSIMap',
    props: {
      key: String,
      imsis: Array.join(','),
      mac: String,
      areas: JSON.stringify(),
      time: Number
    }
  }
```

### MAC关联Car地图

```javascript
  {
    path: 'map/analyze/mac/join/car',
    name: 'AnalyzeToolMACJoinCarMap',
    props: {
      key: String,
      cars: Array.join(','),
      mac: String,
      areas: JSON.stringify(),
      time: Number
    }
  }
```

### Car关联IMSI地图

```javascript
  {
    path: 'map/analyze/car/join/imsi',
    name: 'AnalyzeToolCarJoinIMSIMap',
    props: {
      key: String,
      imsis: Array.join(','),
      car: String,
      areas: JSON.stringify(),
      time: Number
    }
  }
```

### Car关联MAC地图

```javascript
  {
    path: 'map/analyze/car/join/mac',
    name: 'AnalyzeToolCarJoinMACMap',
    props: {
      key: String,
      macs: Array.join(','),
      car: String,
      areas: JSON.stringify(),
      time: Number
    }
  }
```

## 研判工具-集合运算

### IMSI集合运算

```javascript
  {
    path: 'map/analyze/imsi/calculation',
    name: 'AnalyzeToolIMSICalculation'
  }
```

### MAC集合运算

```javascript
  {
    path: 'map/analyze/mac/calculation',
    name: 'AnalyzeToolMACCalculation'
  }
```

### Car集合运算

```javascript
  {
    path: 'map/analyze/car/calculation',
    name: 'AnalyzeToolCarCalculation'
  }
```
