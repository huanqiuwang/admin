<template>
  <ty-map :center="{ lng: 106.5599, lat: 29.5799 }">
    <router-view />
  </ty-map>
</template>

<script>
  import Map from './map'

  export default {
    components: {
      'ty-map': Map
    }
  }
</script>
