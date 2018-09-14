<template>
  <div v-show="false" />
</template>

<script>
  const addArrows = function (map, polyline, length = 20, angle = Math.PI / 12) {
    let points = polyline.getPath()
    let count = points.length
    let arrows = []
    for (let i = 1; i < count; i++) {
      let pointStart = points[i - 1]
      let pointEnd = points[i]
      if (pointStart.equals(pointEnd)) {
        continue
      }
      let pixelStart = map.pointToPixel(pointStart)
      let pixelEnd = map.pointToPixel(pointEnd)
      let pixelTempX, pixelTempY
      let pixelX1, pixelY1, pixelX2, pixelY2
      if (pixelEnd.x - pixelStart.x === 0) {
        pixelTempX = pixelEnd.x
        if (pixelEnd.y > pixelStart.y) {
          pixelTempY = pixelEnd.y - length
        } else {
          pixelTempY = pixelEnd.y + length
        }
        pixelX1 = pixelTempX - length * Math.tan(angle)
        pixelX2 = pixelTempX + length * Math.tan(angle)
        pixelY1 = pixelY2 = pixelTempY
      } else {
        let delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x)
        let param = Math.sqrt(delta * delta + 1)
        if ((pixelEnd.x - pixelStart.x) < 0) {
          pixelTempX = pixelEnd.x + length / param
          pixelTempY = pixelEnd.y + delta * length / param
        } else {
          pixelTempX = pixelEnd.x - length / param
          pixelTempY = pixelEnd.y - delta * length / param
        }
        pixelX1 = pixelTempX + Math.tan(angle) * length * delta / param
        pixelY1 = pixelTempY - Math.tan(angle) * length / param
        pixelX2 = pixelTempX - Math.tan(angle) * length * delta / param
        pixelY2 = pixelTempY + Math.tan(angle) * length / param
      }
      let arrowLeft = map.pixelToPoint(new TYMap.Pixel(pixelX1, pixelY1))
      let arrowRight = map.pixelToPoint(new TYMap.Pixel(pixelX2, pixelY2))
      let arrow = new TYMap.Polygon([arrowLeft, pointEnd, arrowRight], {
        fillColor: '#1890ff',
        fillOpacity: 1,
        strokeWeight: 3,
        strokeColor: '#1890ff',
        strokeOpacity: 1
      })
      map.addOverlay(arrow)
      arrows.push(arrow)
    }
    return arrows
  }

  export default {
    props: {
      points: {
        type: Array,
        default: () => []
      }
    },
    inject: ['getMap'],
    watch: {
      async points (nv, ov) {
        if (nv !== ov) {
          let map = await this.getMap()
          this.polyline.setPath(this.getPoints(nv))
          this.removeArrows()
          this.addArrows()
        }
      }
    },
    methods: {
      getPoints (points) {
        return points.map(({ lng, lat }) => new TYMap.Point(lng, lat))
      },
      async addArrows () {
        let map = await this.getMap()
        this.arrows = addArrows(map, this.polyline)
      },
      async removeArrows () {
        let map = await this.getMap()
        for (let arrow of this.arrows) {
          map.removeOverlay(arrow)
        }
        this.arrows = []
      }
    },
    async created () {
      let map = await this.getMap()
      let polyline = new TYMap.Polyline(this.getPoints(this.points), {
        strokeWeight: 5,
        strokeColor: '#1890ff',
        strokeOpacity: 1
      })
      this.arrows = addArrows(map, polyline)
      map.addEventListener('onzoomstart', () => { this.removeArrows() })
      map.addEventListener('onzoomend', () => {
        this.removeArrows()
        this.addArrows()
      })
      this.polyline = polyline
      map.addOverlay(this.polyline)
    },
    async destroyed () {
      let map = await this.getMap()
      map.removeOverlay(this.polyline)
    }
  }
</script>
