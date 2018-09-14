<template>
  <Map ref="tymap" :zoom="11" :center="center">
    <div class="heatmap" id="heatmap">
      <div ref="heatmap" style="width: 100%; height: 100%;" />
    </div>
  </Map>
</template>

<script>
  import sleep from 'sleep'
  import Map from '../../components/Map/map'
  import h337 from './heatmap'
  import points from './points'

  export default {
    data () {
      return {
        center: { lng: 109.033394, lat: 22.162429 }
      }
    },
    components: {
      Map
    },
    async mounted () {
      await sleep(1000)
      let map = this.$refs.tymap.map
      let heatmap = h337.create({
        container: this.$refs.heatmap,
        radius: 100,
        maxOpacity: .6,
        minOpacity: 0,
        blur: 1
      })
      heatmap.setData({
        min: 0,
        max: 20,
        data: points.map(({ lng, lat }, index) => {
          let { x, y } = map.pointToPixel(new TYMap.Point(lng, lat))
          return { x, y }
        })
      })

      let dom = document.querySelector("#heatmap")
      dom.addEventListener('click', ({ clientX, clientY }) => {
        console.log(clientX, clientY, map.pixelToPoint(new TYMap.Pixel(clientX, clientY)))
      })
    }
  }
</script>

<style>
  html, body {
    position: relative;
    height: 100%;
    margin: 0;
  }

  .heatmap {
    position: absolute;
    z-index: 9999;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-image: url("./background.png");
    background-size: cover;
  }
</style>
