<template>
	<div class="menu-list">
	    <div :style="'padding-left: ' + (depth || 0)*20 + 'px'" :class="{active: model.id == current}"
	    	class="menu-item" 
  	        @click="toggle">
  	        <span v-if="isFolder" :class="open?'el-icon-caret-bottom':'el-icon-caret-right'"></span>
  	        <span>{{model.name}}</span>
  	        <span class="el-icon-more" @click.stop="showCopration(model.id)"></span>
			<copration-case
				@copration="choose"
				@closeBtn="closeBtn"
				v-if="current1 == model.id"
				:id="model.id"></copration-case>
	    </div>

	    <div class="menu-ul-case" v-show="open" v-if="isFolder">
	      	<department-menu
		        class="item"
		        :depth="(parseInt(depth)||0)+1"
		        v-for="model in model.children"
		        :key="model.id"
		        :model="model" 
		        :current="current"
		        :current1="current1"
		        @choose="choose">
	      	</department-menu>
	    </div>
  	</div>
</template>
<script>
	import copration from './copration.vue';

	export default {
		name: 'department-menu',
		props: {
		    model: Object,
		    current: {
		    	required: false
		    },
		    current1: {
		    	required: false
		    },
		    depth: {
		    	required: false
		    }
	  	},
	  	components: {
	  		'copration-case': copration
	  	},
	  	data: function () {
		    return {
		      	open: false
		    }
	  	},
 	 	computed: {
		    isFolder: function () {
		      return this.model.children &&
		        this.model.children.length
		    }
	  	},
	  	methods: {
		    toggle: function () {
		      	if (this.isFolder) {
			        this.open = !this.open
		      	}
		      this.choose(this.model)
		    },
		    choose (info) {
		    	this.$emit('choose', {
		    		id: info.id,
		    		type: info.type || ''
		    	})
		    },
		    showCopration: function(id){
				this.$emit('choose', {
		    		id: id,
		    		type: 'showCopration'
		    	})
			},
			copration: function(e){
				this.$emit("copration", e);
			},
			closeBtn: function(){
				this.$emit('choose', {
					id: '',
					type: 'close'
				})
			}
	  	}
	}
</script>
<style lang="scss">
	.menu-item{
		position: relative;
		padding: 6px 0;
		.el-icon-more{
			position: absolute;
			right: 5px;
			top: 8px;
			transform: rotate(90deg);
			font-size: 15px;
			display: none;
		}
		&.active{
			background: #1890ff;
			color: white;
			.el-icon-more{
				display: block;
			}
		}
	}
</style>