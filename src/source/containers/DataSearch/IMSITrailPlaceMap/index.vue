<template>
  <ty-map :center="center">
    <ty-map-point v-for="{ deviceId, lon, lat, collectNumber } of filteredPoints" :key="deviceId" :lng="lon" :lat="lat" :icon="pointHighlightId === deviceId ? pointHighlightIcon : pointIcon" :top="pointHighlightId === deviceId" :highlight="pointHighlightId === deviceId" @onClick="onClickDetail({ deviceId, lon, lat })">
      <ty-map-label :text="collectNumber > 99 ? '99+' : String(collectNumber)" :offset="labelOffset" :css="pointHighlightId === deviceId ? labelHighlightStyle : labelStyle" />
    </ty-map-point>
    <ty-map-info-window :content="infoWindowContent" :width="220" :height="90" :offset="infoWindowOffset" :point="highlightPoint" @onClose="clearPointHighlightId()" />
    <ty-map-sider v-if="detailMode" slot="sider" v-model="detailKeyword" @onSearch="onSearchDetail" @onClear="onSearchDetail">
      <template slot="footer-header">
        <sider-back :data="info.data" :point="detailPoint" @onBack="onClickDetailBack" />
        <sider-sorter @onSort="onClickDetailSorter" />
      </template>
      <sider-detail v-for="(detail, index) of filteredDetailPoints" :key="detail.id" :index="index + 1" :detail="detail" :highlight="detailPointHighlightId === detail.id" @onClick="onClickDetailPoint(detail.id)" />
    </ty-map-sider>
    <ty-map-sider v-else slot="sider" v-model="keyword" @onSearch="onSearchPoint" @onClear="onSearchPoint">
      <sider-info :info="info" slot="footer-header" />
      <sider-point v-for="point of filteredPoints" :key="point.deviceId" :address="em(point.address)" :point="point" :highlight="pointHighlightId === point.deviceId" @onClick="onClickPoint(point)" @onClickDetail="onClickDetail(point)" />
    </ty-map-sider>
  </ty-map>
</template>

<script>
  import { format } from 'date-fns'
  import AJAX, { CancelToken } from 'ajax'
  import percentage from 'percentage'
  import Map from '../../../components/Map/map'
  import Point from '../../../components/Map/point'
  import Label from '../../../components/Map/label'
  import InfoWindow from '../../../components/Map/info.window'
  import Sider from '../../../components/Map/sider'
  import SiderPoint from './point'
  import SiderDetail from './detail'
  import SiderBack from './sider.back'
  import SiderSorter from '../../../components/Map/sider.sorter'
  import SiderInfo from './sider.info'
  import pointImage from '../../../../assets/img/point.png'
  import pointHighlightImage from '../../../../assets/img/point-highlight.png'

  const pointIcon = new TYMap.Icon(pointImage, new TYMap.Size(27, 32), {
    offset: new TYMap.Size(14, 32)
  })
  const pointHighlightIcon = new TYMap.Icon(pointHighlightImage, new TYMap.Size(35, 50), {
    offset: new TYMap.Size(18, 50)
  })
  const labelStyle = {
    width: '20px',
    textAlign: 'center',
    height: '14px',
    lineHeight: '14px',
    backgroundColor: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  }
  const labelHighlightStyle = {
    ...labelStyle,
    width: '27px',
    height: '20px',
    lineHeight: '20px',
    fontSize: '14px'
  }

  export default {
    name: 'DataSearchIMSITrailPlaceMap',
    props: {
      pkey: {
        type: String,
        required: true
      },
    },
    data () {
      return {
        info: {},
        keyword: '',
        filteredKeyword: '',
        points: [],
        filteredPoints: [],
        pointHighlightId: undefined,
        detailMode: false,
        detailKeyword: '',
        filteredDetailKeyword: '',
        detailPoints: [],
        filteredDetailPoints: [],
        detailPoint: undefined,
        detailPointHighlightId: undefined,
        cancel: undefined,
        center: { lng: 106.5599, lat: 29.5799 },
        pointIcon,
        pointHighlightIcon,
        labelOffset: { x: 3, y: 6 },
        labelStyle,
        labelHighlightStyle,
        infoWindowOffset: { x: 0, y: -55 }
      }
    },
    computed: {
      regexp () {
        return new RegExp(this.filteredKeyword, 'g')
      },
      highlightPoint () {
        if (this.pointHighlightId === undefined) {
          return undefined
        }
        let { address, collectNumber, lateTime, lon, lat } = this.filteredPoints.find(({ deviceId }) => deviceId === this.pointHighlightId)
        return { address, collectNumber, lateTime, lng: lon, lat: lat }
      },
      infoWindowContent () {
        if (this.pointHighlightId === undefined) {
          return ''
        }
        let { address, collectNumber, lateTime } = this.highlightPoint
        return `
          <div style="line-height: 30px; font-size: 14px; white-space: nowrap;">
            <div style="overflow: hidden; text-overflow: ellipsis;" title="${address}">地点：${address}</div>
            <div>采集数：${collectNumber}</div>
            <div>最近采集时间：${format(lateTime * 1000, 'YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        `
      }
    },
    watch: {
      pkey (nv, ov) {
        if (nv !== ov) {
          this.reset()
          this.loadData()
        }
      },
      filteredKeyword (nv, ov) {
        let keyword = nv.trim()
        if (keyword !== ov.trim()) {
          let filteredPoints = keyword ? this.points.filter(({ address }) => address.indexOf(keyword) !== -1) : this.points
          if (this.pointHighlightId !== undefined) {
            let index = filteredPoints.findIndex(({ deviceId }) => deviceId === this.pointHighlightId)
            if (index === -1) {
              this.pointHighlightId = undefined
            }
          }
          this.filteredPoints = filteredPoints
        }
      },
      filteredDetailKeyword (nv, ov) {
        let keyword = nv.trim()
        if (keyword !== ov.trim()) {
          let filteredPoints = this.getFilteredDetailPoints(this.detailPoints, keyword)
          if (this.detailPointHighlightId !== undefined) {
            let index = filteredPoints.findIndex(({ id }) => id === this.detailPointHighlightId)
            if (index === -1) {
              this.detailPointHighlightId = undefined
            }
          }
          this.filteredDetailPoints = filteredPoints
        }
      }
    },
    methods: {
      reset () {
        this.keyword = ''
        this.filteredKeyword = ''
        this.pointHighlightId = undefined
        this.points = []
        this.filteredPoints = []
        this.onClickDetailBack()
      },
      async loadData () {
        if (this.pkey && this.pkey.trim()) {
          let { IMSI, addressNumber, collectNumber, areaNumber, result: points } = await AJAX.post('search/map/data/imsi/location/list', {
            mapKey: this.pkey
          })
          this.info = { data: IMSI, addressNumber, collectNumber, areaNumber }
          this.points = points
          this.filteredPoints = points
          if (points && points.length) {
            this.onClickPoint(points[0])
          }
        }
      },
      em (address) {
        return this.filteredKeyword ? address.replace(this.regexp, `<em class="em">${this.filteredKeyword}</em>`) : address
      },
      clearPointHighlightId () {
        this.pointHighlightId = undefined
      },
      getFilteredDetailPoints (points, keyword = '') {
        let regexp = new RegExp(keyword, 'g')
        let em = `<em class="em">${keyword}</em>`
        return keyword.trim() ? points.filter(({ time }) => time.indexOf(keyword) !== -1).map(({ id, time }) => ({
          id,
          time: time.replace(regexp, em)
        })) : [...points]
      },
      onClickDetailPoint (id) {
        this.detailPointHighlightId = id
      },
      onClickPoint ({ deviceId, lon, lat }) {
        if (this.pointHighlightId !== deviceId) {
          this.pointHighlightId = deviceId
          this.center = { lng: lon, lat: lat }
        }
      },
      async onClickDetail (point) {
        this.onClickPoint(point)
        if (!this.detailMode || this.detailPoint.deviceId !== point.deviceId) {
          this.detailPoint = point
          this.detailPointHighlightId = undefined
          this.detailPoints = []
          this.filteredDetailPoints = []
          this.detailMode = true
          if (this.cancel) {
            this.cancel.cancel('request cancelled.')
          }
          this.cancel = CancelToken.source()
          let { result = [] } = await AJAX.post('search/map/data/imsi/location/info/list', { mapKey: this.pkey, deviceId: point.deviceId }, { cancelToken: this.cancel.token })
          this.cancel = undefined
          let detailPoints = result.map((time, index) => ({ id: index, time: format(time * 1000, 'YYYY-MM-DD HH:mm:ss') }))
          this.detailPoints = detailPoints
          this.filteredDetailPoints = this.getFilteredDetailPoints(detailPoints, this.filteredDetailKeyword)
        }
      },
      onSearchPoint () {
        this.filteredKeyword = this.keyword.trim()
      },
      onSearchDetail () {
        this.filteredDetailKeyword = this.detailKeyword
      },
      onClickDetailBack () {
        this.detailMode = false
        this.detailKeyword = ''
        this.filteredDetailKeyword = ''
        this.detailPointHighlightId = undefined
        this.detailPoint = undefined
        this.detailPoints = []
        this.filteredDetailPoints = []
      },
      onClickDetailSorter () {
        this.detailPoints.reverse()
        this.filteredDetailPoints.reverse()
      }
    },
    components: {
      'ty-map': Map,
      'ty-map-point': Point,
      'ty-map-label': Label,
      'ty-map-info-window': InfoWindow,
      'ty-map-sider': Sider,
      'sider-point': SiderPoint,
      'sider-back': SiderBack,
      'sider-sorter': SiderSorter,
      'sider-info': SiderInfo,
      'sider-detail': SiderDetail
    },
    async created () {
      this.loadData();
    }
  }
</script>

<style lang="scss" scoped>
</style>
