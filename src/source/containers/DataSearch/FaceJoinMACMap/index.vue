<template>
  <ty-map :center="center">
    <ty-map-point v-for="({ lon: lng, lat, count }, index) of filteredPoints" :key="index" :lng="lng" :lat="lat" :icon="pointHighlightIndex === index ? pointHighlightIcon : pointIcon" :top="pointHighlightIndex === index" :highlight="pointHighlightIndex === index" @onClick="onClickPoint(index, lng, lat)">
      <ty-map-label :text="count > 99 ? '99+' : String(count)" :offset="labelOffset" :css="pointHighlightIndex === index ? labelHighlightStyle : labelStyle" />
    </ty-map-point>
    <ty-map-info-window :content="infoWindowContent" :width="220" :height="90" :offset="infoWindowOffset" :point="highlightPoint" @onClose="setPointHighlightIndex()" />
    <ty-map-sider v-if="targetDetailMode" slot="sider" v-model="targetDetailKeyword" @onSearch="onSearchTargetDetail" @onClear="onSearchTargetDetail">
      <sider-back :point="detailPoint" slot="footer-header" @onBack="onClickTargetDetailBack" />
      <sider-detail v-for="(detail, index) of filteredDetailPoints" :key="index" :index="index + 1" :detail="detail" :highlight="detailPointHighlightIndex === index" @onClick="onClickDetailPoint(detail, index)" />
    </ty-map-sider>
    <ty-map-sider v-else-if="addressDetailMode" slot="sider" v-model="addressDetailKeyword" @onSearch="onSearchAddressDetail" @onClear="onSearchAddressDetail">
      <sider-back :point="detailPoint" slot="footer-header" @onBack="onClickAddressDetailBack" />
      <sider-detail v-for="(detail, index) of filteredDetailPoints" :key="index" :index="index + 1" :detail="detail" :highlight="detailPointHighlightIndex === index" @onClick="onClickDetailPoint(detail, index)" />
    </ty-map-sider>
    <ty-map-sider v-else slot="sider" v-model="keyword" @onSearch="onSearchPoint" @onClear="onSearchPoint">
      <sider-point v-for="point of filteredSiderPoints" :key="point.DATA" :mac="em(point.DATA)" :point="point" :highlight="siderHighlightId === point.DATA" @onClick="onClickSiderPoint(point)" @onClickDetail="onClickSiderDetail(point)" />
    </ty-map-sider>
  </ty-map>
</template>

<script>
  import { format } from 'date-fns'
  import AJAX, { CancelToken } from 'ajax'
  import Map from '../../../components/Map/map'
  import Point from '../../../components/Map/point'
  import Label from '../../../components/Map/label'
  import InfoWindow from '../../../components/Map/info.window'
  import Sider from '../../../components/Map/sider'
  import SiderPoint from './point'
  import SiderDetail from './detail'
  import SiderBack from './sider.back'
  import pointImage from '../../../../assets/img/point.png'
  import pointHighlightImage from '../../../../assets/img/point-highlight.png'
  // import iframe from '../../../../lib/iframe'
  // import iframeConfig from '../../../../config/iframeConfig'

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
    name: 'DataSearchFaceJoinMACMap',
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
        keyword: '',
        filteredKeyword: '',
        siderPoints: [],
        filteredSiderPoints: [],
        siderHighlightId: undefined,
        points: [],
        filteredPoints: [],
        pointHighlightIndex: undefined,
        targetDetailMode: false,
        targetDetailKeyword: '',
        filteredTargetDetailKeyword: '',
        addressDetailMode: false,
        addressDetailKeyword: '',
        filteredAddressDetailKeyword: '',
        detailPoints: [],
        filteredDetailPoints: [],
        detailPoint: undefined,
        detailPointHighlightIndex: undefined,
        cache: {},
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
      infoWindowContent () {
        if (this.pointHighlightIndex === undefined) {
          return ''
        }
        let { deviceName, address, count } = this.filteredPoints[this.pointHighlightIndex]
        return `
          <div style="line-height: 30px; font-size: 14px; white-space: nowrap;">
            <div style="font-weight: bold;">${deviceName}</div>
            <div style="overflow: hidden; text-overflow: ellipsis;" title="${address}">地点：${address}</div>
            <div>采集次数：${count}</div>
          </div>
        `
      },
      highlightPoint () {
        if (this.pointHighlightIndex === undefined) {
          return undefined
        }
        let { lon: lng, lat } = this.filteredPoints[this.pointHighlightIndex]
        return { lng, lat }
      },
      siderHighlightPoint () {
        if (this.siderHighlightId === undefined) {
          return undefined
        }
        return this.filteredSiderPoints.find(({ DATA }) => DATA === this.siderHighlightId)
      }
    },
    watch: {
      pkey (nv, ov) {
        if (nv !== ov) {
          this.reset()
          if (this.macs && this.macs.trim()) {
            // this.loadData()
          }
        }
      },
      macs (nv, ov) {
        if (nv !== ov) {
          this.reset()
          if (this.pkey && this.pkey.trim()) {
            this.loadData()
          }
        }
      },
      filteredKeyword (nv, ov) {
        let keyword = nv.trim()
        if (keyword !== ov.trim()) {
          let filteredSiderPoints = keyword ? this.siderPoints.filter(({ DATA }) => DATA.indexOf(keyword) !== -1) : this.siderPoints
          if (this.siderHighlightId !== undefined) {
            let index = filteredSiderPoints.findIndex(({ DATA }) => DATA === this.siderHighlightId)
            if (index === -1) {
              this.beforeSiderHighlightIdChange()
              this.siderHighlightId = undefined
            }
          }
          this.filteredSiderPoints = filteredSiderPoints
        }
      },
      filteredTargetDetailKeyword (nv, ov) {
        let keyword = nv.trim()
        if (keyword !== ov.trim()) {
          this.detailPointHighlightIndex = undefined
          this.pointHighlightIndex = undefined
          this.filteredDetailPoints = keyword ? this.getFilteredDetailPoints(this.detailPoints, keyword) : this.detailPoints
          this.filteredPoints = keyword ? this.points.filter(({ lon: lng, lat }) => this.filteredDetailPoints.findIndex(point => point.lng === lng && point.lat === lat) !== -1) : this.points
        }
      },
      filteredAddressDetailKeyword (nv, ov) {
        let keyword = nv.trim()
        if (keyword !== ov.trim()) {
          this.detailPointHighlightIndex = undefined
          this.filteredDetailPoints = keyword ? this.getFilteredDetailPoints(this.detailPoints, keyword) : this.detailPoints
        }
      }
    },
    methods: {
      reset () {
        this.siderHighlightId = undefined
        this.keyword = ''
        this.filteredKeyword = ''
        this.siderPoints = []
        this.filteredSiderPoints = []
        this.pointHighlightIndex = undefined
        this.points = []
        this.filteredPoints = []
        this.onClickTargetDetailBack()
        this.onClickAddressDetailBack()
        this.cache = {}
      },
      async loadData () {
        if (this.pkey && this.pkey.trim() && this.macs && this.macs.trim()) {
          let { result: siderPoints } = await AJAX.post('contact/map/list/mac', {
            mapKey: this.pkey,
            list: this.macs
          })
          this.siderPoints = siderPoints
          this.filteredSiderPoints = siderPoints
          if (siderPoints && siderPoints.length) {
            this.onClickSiderPoint(siderPoints[0])
          }
        }
      },
      em (mac) {
        return this.filteredKeyword ? mac.replace(this.regexp, `<em class="em">${this.filteredKeyword}</em>`) : mac
      },
      setPointHighlightIndex (index) {
        this.pointHighlightIndex = index
      },
      beforeSiderHighlightIdChange () {
        this.pointHighlightIndex = undefined
        this.points = []
        this.filteredPoints = []
      },
      getFilteredDetailPoints (points, keyword = '') {
        let regexp = new RegExp(keyword, 'g')
        let em = `<em class="em">${keyword}</em>`
        return keyword ? points.filter(({ address, time }) => address.indexOf(keyword) !== -1 || time.indexOf(keyword) !== -1).map(({ address, time, lng, lat }) => ({
          address: address.replace(regexp, em),
          time: time.replace(regexp, em),
          lng,
          lat
        })) : points
      },
      async getTargetDetailPoints () {
        if (this.siderHighlightId === undefined) {
          return []
        }
        let points = this.cache[this.siderHighlightId]
        if (!points) {
          if (this.cancel) {
            this.cancel.cancel('request cancelled.')
          }
          this.cancel = CancelToken.source()
          let { result } = await AJAX.post(`contact/map/info/mac`, { mapKey: this.pkey, data: this.siderHighlightId }, { cancelToken: this.cancel.token })
          this.cancel = undefined
          points = result.map(({ location, time, lon, lat }) => ({ address: location, time: format(time * 1000, 'YYYY-MM-DD HH:mm:ss'), lng: Number.parseFloat(lon), lat: Number.parseFloat(lat) }))
          this.cache[this.siderHighlightId] = points
        }
        return points
      },
      async onClickPoint (index, lng, lat) {
        if (!this.addressDetailMode || this.pointHighlightIndex !== index) {
          this.detailPointHighlightIndex = undefined
          this.pointHighlightIndex = index
          this.targetDetailMode = false
          this.addressDetailMode = true
          this.detailPoint = this.siderHighlightPoint
          let points = await this.getTargetDetailPoints()
          points = points.filter(point => point.lng === lng && point.lat === lat)
          this.detailPoints = points
          this.filteredDetailPoints = this.getFilteredDetailPoints(points, this.filteredAddressDetailKeyword.trim())
        }
      },
      onClickDetailPoint (detail, index) {
        this.detailPointHighlightIndex = index
        let i = this.filteredPoints.findIndex(({ lon: lng, lat }) => detail.lng === lng && detail.lat === lat)
        if (this.pointHighlightIndex !== i) {
          this.pointHighlightIndex = i
        }
      },
      onClickSiderPoint ({ DATA, list }) {
        if (this.siderHighlightId !== DATA) {
          this.beforeSiderHighlightIdChange()
          this.siderHighlightId = DATA
          this.points = list
          this.filteredPoints = list
          if (list && list.length) {
            let { lon: lng, lat } = list[0]
            this.center = { lng, lat }
          }
        }
      },
      async onClickSiderDetail (point) {
        this.onClickSiderPoint(point)
        this.targetDetailMode = true
        this.detailPoint = point
        let points = await this.getTargetDetailPoints()
        this.detailPoints = points
        this.filteredDetailPoints = points
      },
      onSearchPoint () {
        this.filteredKeyword = this.keyword.trim()
      },
      onSearchTargetDetail () {
        this.filteredTargetDetailKeyword = this.targetDetailKeyword
      },
      onClickTargetDetailBack () {
        this.targetDetailMode = false
        this.targetDetailKeyword = ''
        this.filteredTargetDetailKeyword = ''
        this.detailPointHighlightIndex = undefined
        this.detailPoints = []
        this.filteredDetailPoints = []
        this.detailPoint = undefined
      },
      onSearchAddressDetail () {
        this.filteredAddressDetailKeyword = this.addressDetailKeyword
      },
      onClickAddressDetailBack () {
        this.onClickTargetDetailBack()
        this.addressDetailMode = false
        this.addressDetailKeyword = ''
        this.filteredAddressDetailKeyword = ''
        this.pointHighlightIndex = undefined
        this.detailPoints = []
        this.filteredDetailPoints = []
        this.detailPoint = undefined
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
      'sider-detail': SiderDetail
    },
    async created () {
      this.loadData()
    }
  }
</script>

<style lang="scss" scoped>
</style>
