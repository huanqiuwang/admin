Vue.component('menu-item',{
	props: {
		data: {
			type: Object,
			required: true,
			default () {
				return {}
			}
		},
	},
	name: 'menu-item',
	template: `<div class="node-tree-item" :class="data.classname" @click.stop="active(data.id)">
					<span v-if="!!data.child" class="glyphicon glyphicon-plus"></span>
					<span class="glyphicon glyphicon-stop"></span>
					<span class="fa fa-ellipsis-v" @click="showCopration(data.id)"></span>
					<span class="node-content">{{data.text}}</span>
				</div>`,
	data () {
		return {
			classname: '',
		}
	},
	methods: {
		showCopration: function(){
			alert("id");
		},
		active: function(e){
			this.$emit("refreshClass",e);
		}
	},
})


Vue.component('department-menu', {
	props: {
		data: {
			type: Array,
			required: true,
			default () {
				return {}
			}
		}
	},
	name: 'department-menu',
  	template:  `<div class="ty-menu-wrapper">
  				<div v-for="item in data">
					<menu-item @refreshClass="refresh" :data="item"></menu-item>
					<department-menu v-if="!!item.child" :data="item.child"></department-menu>
	  			</div>
  			</div>`,
  	methods: {
  		refresh: function(id){
  			console.log(id);
  			this.$emit("refresh",id);
  		}
  	}
})