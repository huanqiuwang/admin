<template>
  <div v-show="false" />
</template>

<script>
  export default {
    props: {
      center: {
        type: Object,
        required: true,
        validator: value => {
          if (value && value.lng !== undefined && value.lat !== undefined) {
            return true
          }
          return false
        }
      },
      radius: {
        type: Number,
        required: true
      }
    },
    inject: ['getMap'],
    watch: {
      center (nv, ov) {
        if (nv !== ov) {
          let { lng, lat } = nv
          this.circle.setCenter(new TYMap.Point(lng, lat))
        }
      },
      radius (nv, ov) {
        if (nv !== ov) {
          this.circle.setRadius(nv)
        }
      }
    },
    async created () {
      let map = await this.getMap()
      let { lng, lat } = this.center
      let circle = new TYMap.Circle(new TYMap.Point(lng, lat), this.radius)
      circle.addEventListener('click', () => { this.$emit('onClick') })
      this.circle = circle
      map.addOverlay(this.circle)
    },
    async destroyed () {
      let map = await this.getMap()
      map.removeOverlay(this.circle)
    }
  }
</script>
