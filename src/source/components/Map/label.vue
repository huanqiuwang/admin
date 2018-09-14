<template>
  <div v-show="false" />
</template>

<script>
  export default {
    props: {
      text: {
        type: [String, HTMLElement],
        default: ''
      },
      position: {
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
      css: {
        type: Object,
        default: () => ({})
      }
    },
    inject: {
      getMap: 'getMap',
      getMarker: {
        default: undefined
      }
    },
    watch: {
      text (nv, ov) {
        if (nv !== ov) {
          this.label.setContent(nv)
        }
      },
      position (nv, ov) {
        if (nv !== ov) {
          let { lng, lat } = nv
          this.label.setPosition(new TYMap.Point(lng, lat))
        }
      },
      offset (nv, ov) {
        if (nv !== ov) {
          let { x, y } = nv
          this.label.setOffset(new TYMap.Size(x, y))
        }
      },
      css (nv, ov) {
        if (nv !== ov) {
          this.label.setStyle(nv)
        }
      }
    },
    async created () {
      let offset, position
      if (this.offset) {
        let { x, y } = this.offset
        offset = new TYMap.Size(x, y)
      }
      if (this.position) {
        let { lng, lat } = this.position
        position = new TYMap.Point(lng, lat)
      }
      let label = new TYMap.Label(this.text, {
        position,
        offset
      })
      label.setStyle(this.css)
      label.addEventListener('click', () => this.$emit('onClick'))
      this.label = label
      if (position) {
        let map = await this.getMap()
        map.addOverlay(this.label)
      }
      if (this.getMarker) {
        let marker = await this.getMarker()
        marker.setLabel(this.label)
      }
    },
    async destroyed () {
      let map = await this.getMap()
      map.removeOverlay(this.label)
    }
  }
</script>
