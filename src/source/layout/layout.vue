<template>
    <div class="wrapper" :class="menuMode">
        <app-menu 
            @newTab="addNewTab"
            @menuhandle="changeMenuMode"></app-menu>
        <div class="right-content">
            <app-header
                :active="activeMark"
                @slideHandle="menuModeToggle"></app-header>
            <div class="content-wrapper">
                <app-tabs 
                    :tablist="tabs"
                    :index="activeIndex"
                    @changeTabHandle="changeTabItem"
                    @deleteTabHandle="deleteTabItem"></app-tabs>
                <div class="system-wrapper">
                    <transition name="slide-fade">
                        <keep-alive :include="cacheTabs">
                            <router-view></router-view>
                        </keep-alive>
                    </transition>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import appMenu from './appMenu'
    import appHeader from './appHeader'
    import appFooter from './appFooter'
    import appTabs from './appTabs'


    export default {
        data () {
            return {
                tabs: [{
                    text: this.$route.meta.alias,
                    url: this.$route.fullPath,
                    name: this.$route.name,
                    query: this.$route.query || {}
                }],
                activeMark: 'active',
                activeIndex: 0,
                menuMode: 'default',
                cacheTabs: [this.$route.name],
                tabWidth: 133,
                spanWidth: 32
            }
        },
        methods: {
            addNewTab: async function(e){
                if(!this.tabs.find(tab => tab.name === e.name)){
                    this.tabs.push(e);
                }else{
                    this.tabs.find((tab,index) => {
                        if(tab.name === e.name){
                            this.tabs[index] = e;
                        }
                    })
                }
                this.tabs.map((tab,ind) => {
                    if(tab.url === e.url){
                        this.movActive(ind);
                        this.activeIndex = ind;
                        return false;
                    }
                })

                this.$router.push({
                    name: e.name,
                    query: e.query || {}
                });
            },
            movActive: function(e){
                let WE = document.getElementsByClassName("tabs-wrapper")[0],    //  wrapper元素
                    LE = document.getElementsByClassName("tabs-list")[0],       //  list元素
                    total = this.tabs.length * this.tabWidth,                   //  tabs总长度
                    w = WE.offsetWidth - this.spanWidth * 2,                    //  能够显示的宽度
                    now = LE.offsetLeft,                                        //  当前tab的位置
                    movDest = 0;                                                //  移动的目标距离
                if(total < w || e * this.tabWidth + this.spanWidth + now > 0 && (e + 1) * this.tabWidth + this.spanWidth + now < w){
                    return false; 
                }else if(e * this.tabWidth + this.spanWidth + now < 0){                               //  需要往右移动
                    movDest = this.spanWidth - e * this.tabWidth;
                    LE.style.left = movDest + "px";
                }else if((e + 1) * this.tabWidth + this.spanWidth + now > w){                         //  需要往左移动
                    movDest = -(e + 1 - parseInt(w/this.tabWidth)) * this.tabWidth;
                    LE.style.left = movDest + "px";
                }
            },
            changeTabItem: function(e){
                this.$router.replace({
                    name: e.data.name,
                    query: e.data.query || {}
                });
                this.activeIndex = e.index;
            },
            deleteTabItem: function(e){
                var _this = this;
                if(this.tabs.length == 1){                      //  只剩最后的时候，不能被删除
                    return false;
                }else if(e == this.activeIndex && e != 0){      //  目前不在第一个，同时删除目前所在标签
                    this.tabs.splice(e,1);
                    this.activeIndex = this.activeIndex-1;
                    this.$router.replace({
                        name: _this.tabs[e-1].name,
                        query: _this.tabs[e-1].query || {}
                    })
                }else if(e == this.activeIndex && e == 0){      //  目前在第一个，同时删除第一个
                    this.tabs.splice(e,1);
                    this.$router.replace({
                        name: _this.tabs[e].name,
                        query: _this.tabs[e].query || {}
                    });
                }else if(e > this.activeIndex){                 //  删除目前所在标签后面的tab
                    this.tabs.splice(e,1);
                }else if(e < this.activeIndex){                 //  删除目前所在标签前面的tab
                    this.tabs.splice(e,1);
                    this.activeIndex --;
                }

                let WE = document.getElementsByClassName("tabs-wrapper")[0],    //  wrapper元素
                    LE = document.getElementsByClassName("tabs-list")[0],       //  list元素
                    total = this.tabs.length * this.tabWidth,                   //  tabs总长度
                    w = WE.offsetWidth - this.spanWidth * 2,                    //  能够显示的宽度
                    now = LE.offsetLeft,                                        //  当前tab的位置
                    movLength = 0;                                              //  移动的目标距离
                if(now < 32 && total + now < this.tabWidth + this.spanWidth){
                    movLength = parseInt(w/this.tabWidth)*this.tabWidth;
                    LE.style.left = (LE.offsetLeft + movLength > 32)?"32px":LE.offsetLeft + movLength + "px";
                }
            },

            //  菜单展开
            changeMenuMode: function(){
                if(this.menuMode == 'mini-mode'){
                    this.menuMode = 'default';
                    this.activeMark = 'active';
                }
            },
            menuModeToggle: function(){
                if(this.activeMark == 'active'){
                    this.activeMark = '';
                    this.menuMode = 'mini-mode';
                }else{
                    this.activeMark = 'active'
                    this.menuMode = 'default';
                }
            }
        },
        watch: {
            tabs: function(){
                var arr = [];
                this.tabs.map(e => arr.push(e.name));
                this.cacheTabs = arr.join(',');
            }
        },
        computed: {
            isCollapse: function(){
                return store.state.menuStatus;
            }
        },
        components: {
            'app-menu': appMenu,
            'app-header': appHeader,
            'app-footer': appFooter,
            'app-tabs': appTabs
        },
        created: function(){
            // console.log(this.$route)
        }
        
    }

</script>

<style lang="scss">
    @import '../../assets/scss/index.scss';
</style>
