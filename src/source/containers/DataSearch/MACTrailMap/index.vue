<template>
  <ty-map :center="center">
    <ty-map-polyline :points="polyline" />
    <ty-label v-for="({ id, lng, lat }, index) of centerPoints" :key="id" :position="{ lng, lat }" :offset="labelCenter.offset" :css="labelCenter.css" @onClick="onClickPoint(centerPoints.length - index)" />
    <ty-label v-if="lastPoint" :position="lastPoint" :offset="labelLast.offset" :css="labelLast.css" @onClick="onClickPoint(0)" />
    <ty-label v-if="firstPoint" :position="firstPoint" :offset="labelFirst.offset" :css="labelFirst.css" @onClick="onClickPoint(filteredPoints.length - 1)" />
    <ty-label v-if="highlightPoint" :text="labelRipple.text" :position="highlightPoint" :css="labelRipple.css" />
    <ty-map-sider slot="sider" :loading="loading" v-model="keyword" @onSearch="onSearch" @onClear="onSearch">
      <div class="sider-header" slot="footer-header">MAC：{{ mac }}</div>
      <sider-point v-for="({ id, time, address }, index) of filteredPoints" :key="id" :index="index + 1" :time="em(time)" :address="em(address)" :highlight="highlight === index" @onClick="onClickPoint(index)" />
    </ty-map-sider>
    <trail-tip class="tip" />
  </ty-map>
</template>

<script>
  import { format } from 'date-fns'
  import AJAX from 'ajax'
  import sleep from 'sleep'
  import Map from '../../../components/Map/map'
  import Label from '../../../components/Map/label'
  import Polyline from '../../../components/Map/polyline'
  import Sider from '../../../components/Map/sider'
  import TrailTip from '../../../components/Map/trail.tip'
  import SiderPoint from './point'
  import pointImgFirst from '../../../../assets/img/point-trail-first.png'
  import pointImgCenter from '../../../../assets/img/point-trail-center.png'
  import pointImgLast from '../../../../assets/img/point-trail-last.png'
  // import iframe from '../../../../lib/iframe'
  // import iframeConfig from '../../../../config/iframeConfig'

  export default {
    name: 'DataSearchMACTrailMap',
    props: {
      pkey: {
        type: String,
        required: true
      },
      macs: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        loading: false,
        keyword: '',
        filteredKeyword: '',
        mac: '',
        points: [],
        filteredPoints: [],
        highlight: undefined,
        center: { lng: 106.5599, lat: 29.5799 },
        labelFirst: {
          offset: { x: -10, y: -10 },
          css: { width: '20px', height: '20px', padding: 0, border: 0, borderRadius: '100%', background: `transparent url('${pointImgFirst}')`, cursor: 'pointer' }
        },
        labelCenter: {
          offset: { x: -11, y: -11 },
          css: { width: '22px', height: '22px', padding: 0, border: 0, borderRadius: '100%', background: `transparent url('${pointImgCenter}')`, cursor: 'pointer' }
        },
        labelLast: {
          offset: { x: -10, y: -32 },
          css: { width: '20px', height: '32px', padding: 0, border: 0, background: `transparent url('${pointImgLast}')`, cursor: 'pointer' }
        },
        labelRipple: {
          text: '<div class="ripple1"></div><div class="ripple2"></div><div class="ripple3"></div>',
          css: { width: 0, height: 0, padding: 0, border: 0 }
        }
      }
    },
    computed: {
      regexp () {
        return new RegExp(this.filteredKeyword, 'g')
      },
      polyline () {
        return [...this.filteredPoints].reverse()
      },
      firstPoint () {
        return this.polyline[0]
      },
      centerPoints () {
        return this.polyline.slice(1, this.polyline.length - 1)
      },
      lastPoint () {
        return this.polyline[Math.max(1, this.polyline.length - 1)]
      },
      highlightPoint () {
        return this.highlight === undefined ? undefined : this.filteredPoints[this.highlight]
      },
      unionKey: function(){
        return this.pkey + this.macs;
      }
    },
    watch: {
      unionKey (nv, ov) {
        if (nv !== ov) {
          this.reset()
          if (this.macs && this.macs.trim()) {
            this.loadData()
          }
        }
      },
      // pkey (nv, ov) {
      //   if (nv !== ov) {
      //     this.reset()
      //     if (this.macs && this.macs.trim()) {
      //       this.loadData()
      //     }
      //   }
      // },
      // macs (nv, ov) {
      //   if (nv !== ov) {
      //     this.reset()
      //     if (this.pkey && this.pkey.trim()) {
      //       this.loadData()
      //     }
      //   }
      // },
      async filteredKeyword (nv, ov) {
        let keyword = nv.trim()
        if (keyword !== ov.trim()) {
          let highlight
          let filteredPoints = keyword ? this.points.filter(({ time, address }) => time.indexOf(keyword) !== -1 || address.indexOf(keyword) !== -1) : this.points
          if (this.highlight !== undefined) {
            let id = this.filteredPoints[this.highlight].id
            let index = filteredPoints.findIndex(point => id === point.id)
            highlight = index === -1 ? undefined : index
          }
          this.onClickPoint()
          this.filteredPoints = filteredPoints
          await sleep()
          this.onClickPoint(highlight)
        }
      }
    },
    methods: {
      reset () {
        this.highlight = undefined
        this.keyword = ''
        this.filteredKeyword = ''
        this.mac = ''
        this.points = []
        this.filteredPoints = []
      },
      async loadData () {
        if (this.pkey && this.pkey.trim() && this.macs && this.macs.trim()) {
          this.loading = true
          try {
            let { data: mac, result: points } = await AJAX.post('search/map/data/mac', {
              mapKey: this.pkey,
              list: this.macs
            })
            points = (points || []).map(({ RID, lon, lat, address, CAPTURETIME }) => ({ id: RID, lng: lon, lat, address, time: format(CAPTURETIME * 1000, 'YYYY-MM-DD HH:mm:ss') }))
            this.mac = mac
            this.points = points
            this.filteredPoints = points
            if (points.length) {
              this.center = this.points[0]
            }
          } catch (e) {
          }
          this.loading = false
        }
      },
      em (value) {
        return this.filteredKeyword ? value.replace(this.regexp, `<em class="em">${this.filteredKeyword}</em>`) : value
      },
      onClickPoint (index) {
        this.highlight = index
        if (this.highlightPoint) {
          this.center = this.highlightPoint
        }
      },
      onSearch () {
        this.filteredKeyword = this.keyword.trim()
      }
    },
    components: {
      'ty-map': Map,
      'ty-label': Label,
      'ty-map-polyline': Polyline,
      'ty-map-sider': Sider,
      'trail-tip': TrailTip,
      'sider-point': SiderPoint
    },
    async created () {
      this.loadData();
    }
  }
</script>

<style lang="scss" scoped>
  .sider-header {
    text-align: center;
    height: 46px;
    line-height: 46px;
    background-color: #e6f7ff;
    color: #1890ff;
    font-size: 14px;
    letter-spacing: -0.29px;
  }

  .tip {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
</style>
