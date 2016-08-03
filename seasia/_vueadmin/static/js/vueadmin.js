var admin = new Vue({
    el:'html',
    data:{
        screens:[
            {mark:'screenEditRoute', menu:true},
            {mark:'screenPointsTable', menu:true},
            {mark:'screenEditPoint', menu:false},
            {mark:'screenGeosTable', menu:true}
        ]
    },
    methods:{
        activateScreen:function(mark, cmd){
           this.$broadcast('eActivateScreen',{target:mark, 'cmd':cmd}); 
        }
    },

    ready:function(){
        console.log('>admin.ready')
    },

    events:{
        'eTableDblclick':function(e){
            if (e.emitter=='pointsTable'){
                this.activateScreen('screenEditPoint', {op:'edit', id:e.data[0], caption:'Edit point'})
            }
        },
        'eAddNewPoint':function(e){
            this.activateScreen('screenEditPoint', {op:'add', id:null,  caption:'Add new point'})
        },
        'eScreenFinished':function(e){
            if (e.emitter=='screenEditPoint'){
                this.activateScreen('screenPointsTable');
            }
        }
    }
});

