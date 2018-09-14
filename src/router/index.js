import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/source/layout/layout'
import notfound from '@/source/404'
import login from '@/source/home/login'


// 搜索页面
import search from '@/source/dataQuery/search'
import searchEntry from '@/source/dataQuery/searchEntry'
import searchMac from '@/source/dataQuery/mac'
import searchImei from '@/source/dataQuery/imei'
import searchCar from '@/source/dataQuery/car'
import searchFace from '@/source/dataQuery/face'
import sMjoinI from '@/source/dataQuery/macJoinImei'
import sMjoinC from '@/source/dataQuery/macJoinCar'
import sIjoinC from '@/source/dataQuery/imeiJoinCar'
import sIjoinM from '@/source/dataQuery/imeiJoinMac'
import sCjoinI from '@/source/dataQuery/carJoinImei'
import sCjoinM from '@/source/dataQuery/carJoinMac'
import sFjoinM from '@/source/dataQuery/faceJoinMac'
import sFjoinI from '@/source/dataQuery/faceJoinImei'
import searchImeiTogether from '@/source/dataQuery/imeiTogether'
import searchMacTogether from '@/source/dataQuery/macTogether'

// 数据查询
import togetherMac from '@/source/determine/together/mac'
import togetherImei from '@/source/determine/together/imei'
import macImpact from '@/source/determine/impact/mac'
import imsiImpact from '@/source/determine/impact/imsi'
import MjoinI from '@/source/determine/join/macJoinImei'
import MjoinC from '@/source/determine/join/macJoinCar'
import IjoinC from '@/source/determine/join/imsiJoinCar'
import IjoinM from '@/source/determine/join/imsiJoinMac'
import CjoinI from '@/source/determine/join/carJoinImei'
import CjoinM from '@/source/determine/join/carJoinMac'
import areaData from '@/source/dataQuery/areaData.vue'

import MapWrap from '../source/components/Map'

// 数据查询&研判工具 - 同行地图
import IMSITogetherMap from '@/source/containers/IMSITogetherMap'
import MACTogetherMap from '@/source/containers/MACTogetherMap'

// 数据查询 - 轨迹地图
import DataSearchIMSITrailMap from '@/source/containers/DataSearch/IMSITrailMap'
import DataSearchIMSITrailPlaceMap from '@/source/containers/DataSearch/IMSITrailPlaceMap'
import DataSearchIMEITrailMap from '@/source/containers/DataSearch/IMEITrailMap'
import DataSearchIMEITrailPlaceMap from '@/source/containers/DataSearch/IMEITrailPlaceMap'
import DataSearchMACTrailMap from '@/source/containers/DataSearch/MACTrailMap'
import DataSearchMACTrailPlaceMap from '@/source/containers/DataSearch/MACTrailPlaceMap'
import DataSearchCarTrailMap from '@/source/containers/DataSearch/CarTrailMap'
import DataSearchCarTrailPlaceMap from '@/source/containers/DataSearch/CarTrailPlaceMap'
import DataSearchFaceTrailMap from '@/source/containers/DataSearch/FaceTrailMap'
import DataSearchFaceTrailPlaceMap from '@/source/containers/DataSearch/FaceTrailPlaceMap'

// 数据查询 - 关联地图
import DataSearchIMSIJoinMACMap from '@/source/containers/DataSearch/IMSIJoinMACMap'
import DataSearchIMSIJoinCarMap from '@/source/containers/DataSearch/IMSIJoinCarMap'
import DataSearchMACJoinIMSIMap from '@/source/containers/DataSearch/MACJoinIMSIMap'
import DataSearchMACJoinCarMap from '@/source/containers/DataSearch/MACJoinCarMap'
import DataSearchCarJoinIMSIMap from '@/source/containers/DataSearch/CarJoinIMSIMap'
import DataSearchCarJoinMACMap from '@/source/containers/DataSearch/CarJoinMACMap'
import DataSearchFaceJoinIMSIMap from '@/source/containers/DataSearch/FaceJoinIMSIMap'
import DataSearchFaceJoinMACMap from '@/source/containers/DataSearch/FaceJoinMACMap'

// 研判工具 - 碰撞地图
import AnalyzeToolIMSICollisionMap from '@/source/containers/AnalyzeTool/IMSICollisionMap'
import AnalyzeToolMACCollisionMap from '@/source/containers/AnalyzeTool/MACCollisionMap'

// 研判工具 - 关联地图
import AnalyzeToolIMSIJoinCarMap from '@/source/containers/AnalyzeTool/IMSIJoinCarMap'
import AnalyzeToolIMSIJoinMACMap from '@/source/containers/AnalyzeTool/IMSIJoinMACMap'
import AnalyzeToolMACJoinIMSIMap from '@/source/containers/AnalyzeTool/MACJoinIMSIMap'
import AnalyzeToolMACJoinCarMap from '@/source/containers/AnalyzeTool/MACJoinCarMap'
import AnalyzeToolCarJoinIMSIMap from '@/source/containers/AnalyzeTool/CarJoinIMSIMap'
import AnalyzeToolCarJoinMACMap from '@/source/containers/AnalyzeTool/CarJoinMACMap'

// 研判工具 - 集合运算
import AnalyzeToolIMSICalculation from '@/source/containers/AnalyzeTool/IMSICalculation'
import AnalyzeToolMACCalculation from '@/source/containers/AnalyzeTool/MACCalculation'
import AnalyzeToolCarCalculation from '@/source/containers/AnalyzeTool/CarCalculation'



//  案件布控

import CaseInfo from '@/source/CaseControl/CaseManage/index.vue'
import TempraryInfo from '@/source/CaseControl/CaseTemprary/index.vue'
import OwnershipInfo from '@/source/CaseControl/CaseOwnership/index.vue'
import BaseLib from '@/source/containers/AnalyzeTool/BaseLib/index.vue'
// import baseManage from '@/source/CaseControl/BaseManage/index.vue'

Vue.use(Router)

export default new Router({
	routes: [
      	{
		    path: '/',
		    name: 'layout',
    		component: layout,
            redirect: {name: 'search'},
            children: [

                //  数据查询
                {path: 'search/default',component: search,name: "search",meta:{alias: "首页"}},
                {path: 'search/searchEntry',component: searchEntry,name: "searchEntry",meta:{alias: "快捷入口"}},
                {path: 'search/mac/list',component: searchMac,name: "searchMac",meta:{alias: "MAC搜索"}},
                {path: 'search/imei/list',component: searchImei,name: "searchImei",meta:{alias: "IMSI/IMEI搜索"}},
                {path: 'search/car/list' ,component: searchCar,name: "searchCar",meta:{alias: "车牌搜索"}},
                {path: 'search/face/list' ,component: searchFace,name: "searchFace",meta:{alias: "人像查询"}},
                {path: 'search/areadata/list' ,component: areaData,name: "areaData",meta:{alias: "区域数据"}},
                {path: 'search/imei/together',component: searchImeiTogether,name: "searchImeiTogether",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "IMSI/IMEI同行"}},
                {path: 'search/mac/together',component: searchMacTogether,name: "searchMacTogether",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "MAC同行"}},
                {path: 'search/mac/join/imei',component: sMjoinI,name: "sMjoinI",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "MAC关联IMSI/IMEI"}},
                {path: 'search/mac/join/car' ,component: sMjoinC,name: "sMjoinC",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "MAC关联车牌"}},
                {path: 'search/imei/join/mac',component: sIjoinM,name: "sIjoinM",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "IMSI/IMEI关联MAC"}},
                {path: 'search/imei/join/car',component: sIjoinC,name: "sIjoinC",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "IMSI/IMEI关联车牌"}},
                {path: 'search/car/join/mac' ,component: sCjoinM,name: "sCjoinM",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "车牌关联MAC"}},
                {path: 'search/car/join/imei',component: sCjoinI,name: "sCjoinI",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "车牌关联IMSI/IMEI"}},
                {path: 'search/face/join/mac',component: sFjoinM,name: "sFjoinM",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "人像关联MAC"}},
                {path: 'search/face/join/imei',component: sFjoinI,name: "sFjoinI",props: ({ query: { time, json }}) => ({ time, json }),meta:{alias: "人像关联IMSI/IMEI"}},

                //  研判工具
                {path: 'determine/together/mac' ,component: togetherMac,name: "togetherMac",meta:{alias: "MAC同行"}},
                {path: 'determine/together/imei',component: togetherImei,name: "togetherImei",meta:{alias: "IMSI/IMEI同行"}},
                {path: 'determine/impact/mac',component: macImpact,name: "macImpact",meta:{alias: "MAC碰撞"}},
                {path: 'determine/impact/imsi' ,component: imsiImpact,name: "imsiImpact",meta:{alias: "IMSI/IMEI碰撞"}},
                {path: 'determine/mac/join/imei',component: MjoinI,name: "MjoinI",meta:{alias: "MAC关联IMSI/IMEI"}},
                {path: 'determine/mac/join/car' ,component: MjoinC,name: "MjoinC",meta:{alias: "MAC关联车牌"}},
                {path: 'determine/imei/join/mac',component: IjoinM,name: "IjoinM",meta:{alias: "IMSI/IMEI关联MAC"}},
                {path: 'determine/imei/join/car',component: IjoinC,name: "IjoinC",meta:{alias: "IMSI/IMEI关联车牌"}},
                {path: 'determine/car/join/mac' ,component: CjoinM,name: "CjoinM",meta:{alias: "车牌关联MAC"}},
                {path: 'determine/car/join/imei',component: CjoinI,name: "CjoinI",meta:{alias: "车牌关联IMSI/IMEI"}},

                // 案件布控
                {path: 'casecontrol/list' ,component: CaseInfo,name: "CaseInfo",meta:{alias: "案件布控"}},
                {path: 'temprary/list' ,component: TempraryInfo,name: "TempraryInfo",meta:{alias: "临时布控"}},
                {path: 'ownership/list' ,component: OwnershipInfo,name: "OwnershipInfo",meta:{alias: "归属地布控"}},
                {path: 'basehouse/list' ,component: BaseLib,name: "BaseLib",meta:{alias: "底库管理"}},

                // 地图模块
                // 数据查询&研判工具 - 同行地图
                {
                    path: 'map/imsi/together',
                    name: 'IMSITogetherMap',
                    component: IMSITogetherMap,
                    props: ({ query: { key, imsis }}) => ({ pkey: key, imsis }),
                    meta: {alias: "IMSI同行地图"}
                },{
                    path: 'map/mac/together',
                    name: 'MACTogetherMap',
                    component: MACTogetherMap,
                    props: ({ query: { key, macs }}) => ({ pkey: key, macs }),
                    meta: {alias: "MAC同行地图"}
                },
                // 数据查询 - 轨迹地图
                {
                    path: 'map/search/imsi/trail',
                    name: 'DataSearchIMSITrailMap',
                    component: DataSearchIMSITrailMap,
                    props: ({ query: { key, imsis }}) => ({ pkey: key, imsis }),
                    meta: {alias: "IMSI轨迹地图"}
                },{
                    path: 'map/search/imsi/trail/place',
                    name: 'DataSearchIMSITrailPlaceMap',
                    component: DataSearchIMSITrailPlaceMap,
                    props: ({ query: { key }}) => ({ pkey: key }),
                    meta: {alias: "IMSI轨迹地图地点模式"}
                },
                {
                    path: 'map/search/imei/trail',
                    name: 'DataSearchIMEITrailMap',
                    component: DataSearchIMEITrailMap,
                    props: ({ query: { key, imeis }}) => ({ pkey: key, imeis }),
                    meta: {alias: "IMEI轨迹地图"}
                },{
                    path: 'map/search/imei/trail/place',
                    name: 'DataSearchIMEITrailPlaceMap',
                    component: DataSearchIMEITrailPlaceMap,
                    props: ({ query: { key }}) => ({ pkey: key }),
                    meta: {alias: "IMEI轨迹地图地点模式"}
                },{
                    path: 'map/search/mac/trail',
                    name: 'DataSearchMACTrailMap',
                    component: DataSearchMACTrailMap,
                    props: ({ query: { key, macs }}) => ({ pkey: key, macs }),
                    meta: {alias: "MAC轨迹地图"}
                },{
                    path: 'map/search/mac/trail/place',
                    name: 'DataSearchMACTrailPlaceMap',
                    component: DataSearchMACTrailPlaceMap,
                    props: ({ query: { key }}) => ({ pkey: key }),
                    meta: {alias: "MAC轨迹地图地点模式"}
                },{
                    path: 'map/search/car/trail',
                    name: 'DataSearchCarTrailMap',
                    component: DataSearchCarTrailMap,
                    props: ({ query: { key, cars }}) => ({ pkey: key, cars }),
                    meta: {alias: "车牌轨迹地图"}
                },{
                    path: 'map/search/car/trail/place',
                    name: 'DataSearchCarTrailPlaceMap',
                    component: DataSearchCarTrailPlaceMap,
                    props: ({ query: { key, cars }}) => ({ pkey: key, cars }),
                    meta: {alias: "车牌轨迹地图地点模式"}
                },{
                    path: 'map/search/face/trail',
                    name: 'DataSearchFaceTrailMap',
                    component: DataSearchFaceTrailMap,
                    props: ({ query: { key, faces }}) => ({ pkey: key, faces }),
                    meta: {alias: "人像轨迹地图"}
                },{
                    path: 'map/search/face/trail/place',
                    name: 'DataSearchFaceTrailPlaceMap',
                    component: DataSearchFaceTrailPlaceMap,
                    props: ({ query: { key, devices }}) => ({ pkey: key, devices }),
                    meta: {alias: "人像轨迹地图地点模式"}
                },

                // 数据查询 - 关联地图
                {
                    path: 'map/search/imsi/join/mac',
                    name: 'DataSearchIMSIJoinMACMap',
                    component: DataSearchIMSIJoinMACMap,
                    props: ({ query: { key, macs }}) => ({ pkey: key, macs }),
                    meta: {alias: "IMSI/IMEI关联MAC地图"}
                },{
                    path: 'map/search/imsi/join/car',
                    name: 'DataSearchIMSIJoinCarMap',
                    component: DataSearchIMSIJoinCarMap,
                    props: ({ query: { key, cars }}) => ({ pkey: key, cars }),
                    meta: {alias: "IMSI/IMEI关联车牌地图"}
                },{
                    path: 'map/search/mac/join/imsi',
                    name: 'DataSearchMACJoinIMSIMap',
                    component: DataSearchMACJoinIMSIMap,
                    props: ({ query: { key, imsis }}) => ({ pkey: key, imsis }),
                    meta: {alias: "MAC关联IMSI/IMEI地图"}
                },{
                    path: 'map/search/mac/join/car',
                    name: 'DataSearchMACJoinCarMap',
                    component: DataSearchMACJoinCarMap,
                    props: ({ query: { key, cars }}) => ({ pkey: key, cars }),
                    meta: {alias: "MAC关联车牌地图"}
                },{
                    path: 'map/search/car/join/imsi',
                    name: 'DataSearchCarJoinIMSIMap',
                    component: DataSearchCarJoinIMSIMap,
                    props: ({ query: { key, imsis }}) => ({ pkey: key, imsis }),
                    meta: {alias: "车牌关联IMSI/IMEI地图"}
                },{
                    path: 'map/search/car/join/mac',
                    name: 'DataSearchCarJoinMACMap',
                    component: DataSearchCarJoinMACMap,
                    props: ({ query: { key, macs }}) => ({ pkey: key, macs }),
                    meta: {alias: "车牌关联MAC地图"}
                },{
                    path: 'map/search/face/join/imsi',
                    name: 'DataSearchFaceJoinIMSIMap',
                    component: DataSearchFaceJoinIMSIMap,
                    props: ({ query: { key, imsis }}) => ({ pkey: key, imsis }),
                    meta: {alias: "人像关联IMSI地图"}
                },{
                    path: 'map/search/face/join/mac',
                    name: 'DataSearchFaceJoinMACMap',
                    component: DataSearchFaceJoinMACMap,
                    props: ({ query: { key, macs }}) => ({ pkey: key, macs }),
                    meta: {alias: "人像关联MAC地图"}
                },
                // 研判工具 - 碰撞地图
                {
                    path: 'map/analyze/imsi/collision',
                    name: 'AnalyzeToolIMSICollisionMap',
                    component: AnalyzeToolIMSICollisionMap,
                    props: ({ query: { key, imsis }}) => ({ pkey: key, imsis }),
                    meta: {alias: "IMSI/IMEI碰撞地图"}
                },{
                    path: 'map/analyze/mac/collision',
                    name: 'AnalyzeToolMACCollisionMap',
                    component: AnalyzeToolMACCollisionMap,
                    props: ({ query: { key, macs }}) => ({ pkey: key, macs }),
                    meta: {alias: "MAC碰撞地图"}
                },
                // 研判工具 - 关联地图
                {
                    path: 'map/analyze/imsi/join/mac',
                    name: 'AnalyzeToolIMSIJoinMACMap',
                    component: AnalyzeToolIMSIJoinMACMap,
                    props: ({ query: { key, macs, imsi, imei, areas, time }}) => ({ pkey: key, macs, imsi, imei, areas, time }),
                    meta: {alias: "IMSI/IMEI关联MAC地图"}
                },{
                    path: 'map/analyze/imsi/join/car',
                    name: 'AnalyzeToolIMSIJoinCarMap',
                    component: AnalyzeToolIMSIJoinCarMap,
                    props: ({ query: { key, cars, imsi, imei, areas, time }}) => ({ pkey: key, cars, imsi, imei, areas, time }),
                    meta: {alias: "IMSI/IMEI关联车牌地图"}
                },{
                    path: 'map/analyze/mac/join/imsi',
                    name: 'AnalyzeToolMACJoinIMSIMap',
                    component: AnalyzeToolMACJoinIMSIMap,
                    props: ({ query: { key, imsis, mac, areas, time }}) => ({ pkey: key, imsis, mac, areas, time }),
                    meta: {alias: "MAC关联IMSI/IMEI地图"}
                },{
                    path: 'map/analyze/mac/join/car',
                    name: 'AnalyzeToolMACJoinCarMap',
                    component: AnalyzeToolMACJoinCarMap,
                    props: ({ query: { key, cars, mac, areas, time }}) => ({ pkey: key, cars, mac, areas, time }),
                    meta: {alias: "MAC关联车牌地图"}
                },{
                    path: 'map/analyze/car/join/imsi',
                    name: 'AnalyzeToolCarJoinIMSIMap',
                    component: AnalyzeToolCarJoinIMSIMap,
                    props: ({ query: { key, imsis, car, areas, time }}) => ({ pkey: key, imsis, car, areas, time }),
                    meta: {alias: "车牌关联IMSI/IMEI地图"}
                },{
                    path: 'map/analyze/car/join/mac',
                    name: 'AnalyzeToolCarJoinMACMap',
                    component: AnalyzeToolCarJoinMACMap,
                    props: ({ query: { key, macs, car, areas, time }}) => ({ pkey: key, macs, car, areas, time }),
                    meta: {alias: "车牌关联MAC地图"}
                },
                // 研判工具 - 集合运算
                {
                    path: 'map/analyze/imsi/calculation',
                    name: 'AnalyzeToolIMSICalculation',
                    component: AnalyzeToolIMSICalculation,
                    meta: {alias: "IMSI集合运算"}
                },{
                    path: 'map/analyze/mac/calculation',
                    name: 'AnalyzeToolMACCalculation',
                    component: AnalyzeToolMACCalculation,
                    meta: {alias: "MAC集合运算"}
                },{
                    path: 'map/analyze/car/calculation',
                    name: 'AnalyzeToolCarCalculation',
                    component: AnalyzeToolCarCalculation,
                    meta: {alias: "车牌集合运算"}
                }
           ]
      	},{
            name: 'notfound',
            path: '/notfound',
            component: notfound
        },{
            name: 'login',
            path: '/login',
            component: login
        }
  	]
})
