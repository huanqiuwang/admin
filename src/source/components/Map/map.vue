<template>
  <div class="wrap">
    <div class="map" ref="map" />
    <slot />
    <slot name="sider" class="sider" />
  </div>
</template>

<script>
  export default {
    props: {
      center: {
        type: Object,
        validator: value => {
          if (value === undefined || value === null) {
            return true
          } else if (value.lng !== undefined && value.lat !== undefined) {
            return true
          }
          return false
        }
      },
      zoom: {
        type: Number,
        default: 15
      }
    },
    provide () {
      return {
        getMap: this.getMap
      }
    },
    data () {
      let resolve
      let inited = new Promise(r => resolve = r)
      return {
        inited,
        resolve
      }
    },
    watch: {
      center (nv, ov) {
        if (nv !== ov && nv) {
          let { lng, lat } = nv
          this.map.moveTo(new TYMap.Point(lng, lat))
        }
      },
      zoom (nv, ov) {
        if (nv !== ov) {
          this.map.setZoom(nv)
        }
      }
    },
    methods: {
      getMap () {
        return this.inited
      }
    },
    mounted () {
      let center
      if (this.center) {
        let { lng, lat } = this.center
        center = new TYMap.Point(lng, lat)
      }
      this.map = new TYMap.Map(this.$refs.map, {
        zoom: this.zoom,
        center,
        zooms: [3, 19],
        enableScrollWheelZoom: true
      })
      setTimeout(() => {
        this.map.clearOverlays()
        this.resolve(this.map)
      })
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    position: relative;
    height: 100%;
    overflow: hidden;

    .map {
      width: 100%;
      height: 100%;
    }

    .sider {
      position: absolute;
      top: 10px;
      left: 0;
      bottom: 0;
    }
  }
</style>
