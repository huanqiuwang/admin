<template>
  <div v-show="false" />
</template>

<script>
  import sleep from 'sleep'

  export default {
    props: {
      content: {
        type: [String, HTMLElement],
        default: ''
      },
      width: {
        type: Number,
        default: undefined
      },
      height: {
        type: Number,
        default: undefined
      },
      offset: {
        type: Object,
        validator: value => {
          if (value === undefined || value === null) {
            return true
          } else if (value.x !== undefined && value.y !== undefined) {
            return true
          }
          return false
        }
      },
      point: {
        type: Object,
        validator: value => {
          if (value === undefined || value === null) {
            return true
          } else if (value.lng !== undefined && value.lat !== undefined) {
            return true
          }
          return false
        }
      }
    },
    inject: ['getMap'],
    data () {
      return {
        emitable: true
      }
    },
    watch: {
      content (nv, ov) {
        if (nv !== ov) {
          this.infoWindow.setContent(nv)
        }
      },
      width (nv, ov) {
        if (nv !== ov) {
          this.infoWindow.setWidth(width)
        }
      },
      height (nv, ov) {
        if (nv !== ov) {
          this.infoWindow.setHeight(width)
        }
      },
      async point (nv, ov) {
        if (nv !== ov) {
          let map = await this.getMap()
          if (nv) {
            let { lng, lat } = nv
            this.emitable = false
            map.openInfoWindow(this.infoWindow, new TYMap.Point(lng, lat))
            this.emitable = true
          } else {
            map.closeInfoWindow()
          }
        }
      }
    },
    async created () {
      let offset
      if (this.offset) {
        let { x, y } = this.offset
        offset = new TYMap.Size(x, y)
      }
      this.infoWindow = new TYMap.InfoWindow(this.content, {
        width: this.width,
        height: this.height,
        offset
      })
      this.infoWindow.addEventListener('close', () => {
        if (this.emitable) {
          this.$emit('onClose')
        }
      })
      if (this.point) {
        let { lng, lat } = this.point
        let map = await this.getMap()
        map.openInfoWindow(this.infoWindow, new TYMap.Point(lng, lat))
      }
    },
    async destroyed () {
      let map = await this.getMap()
      map.closeInfoWindow()
    }
  }
</script>
