var admin = new Vue({
    el:'html',
    data:{
        screens:[
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
                this.activateScreen('screenEditPoint', {op:'edit', id:e.data[0]})
            }
        }
    }
});

