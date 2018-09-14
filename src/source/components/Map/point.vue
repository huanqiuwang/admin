<template>
  <div v-show="false">
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      lng: {
        type: Number,
        required: true
      },
      lat: {
        type: Number,
        required: true
      },
      icon: {
        type: TYMap.Icon,
        default: undefined
      },
      top: {
        type: Boolean,
        default: false
      },
      highlight: {
        type: Boolean,
        default: false
      }
    },
    inject: ['getMap'],
    provide () {
      return {
        getMarker: this.getMarker
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
      lng (nv, ov) {
        if (nv !== ov) {
          this.setPosition(nv, this.lat)
        }
      },
      lat (nv, ov) {
        if (nv !== ov) {
          this.setPosition(this.lng, nv)
        }
      },
      icon (nv, ov) {
        if (nv !== ov) {
            this.marker.setIcon(nv)
        }
      },
      top (nv, ov) {
        if (nv !== ov) {
          this.marker.setTop(nv)
        }
      }
    },
    methods: {
      getMarker () {
        return this.inited
      },
      setPosition (lng, lat) {
        this.marker.setPosition(new TYMap.Point(lng, lat))
      }
    },
    async created () {
      let map = await this.getMap()
      let marker = new TYMap.Marker(new TYMap.Point(this.lng, this.lat), {
        icon: this.icon
      })
      marker.setTop(this.top)
      marker.addEventListener('click', () => {
        if (!this.highlight) {
          map.closeInfoWindow()
        }
        this.$emit('onClick')
      })
      this.marker = marker
      map.addOverlay(this.marker)
      this.resolve(this.marker)
    },
    async destroyed () {
      let map = await this.getMap()
      map.removeOverlay(this.marker)
    }
  }
</script>
