
var clicks={};

var dataSource={
    testcb:[{caption:'QWertu', status:'on'},{caption:'fsese', status:'off'}],
    activities: [
        {caption:'Beach', status:'off', mark:'beach'},
        {caption:'Nature', status:'off', mark:'nature'},
        {caption:'History', status:'off', mark:'history'},
        {caption:'Culture', status:'off', mark:'culture'},
        {caption:'Food', status:'off', mark:'food'},
        {caption:'Diving', status:'off', mark:'diving'}
    ],
    countries:[
        {caption:'Thailand', status:'on', mark:'thailand'},
        {caption:'Myanmar', status:'on', mark:'myanmar'},
        {caption:'Laos', status:'on', mark:'laos'},
        {caption:'Vietnam', status:'on', mark:'vietnam'},
        {caption:'Cambodia', status:'on', mark:'cambodia'},
        {caption:'Malaysia', status:'on', mark:'malaysia'},
        {caption:'Singapore', status:'on', mark:'singapore'},
        {caption:'Indonesia', status:'on', mark:'indonesia'}
    ],
    presetsList:[
        {id:12, name: 'Bangkok'},
        {id:13, name: 'Siem Reap'},
        {id:19, name: 'Hanoi'},
        {id:32, name: 'Ho Chi Minh'},
        {id:28, name: 'Phnom Penh'},
        {id:29, name: 'Singapore'},
        {id:51, name: 'Phuket'},

    ]
};

//===============================

new Vue ({
    el:'body',
    data:{
        formData:{}
    },
    ready:function(){
        this.$broadcast('setDefaults',{target:'start-place', data:{
            title:'Most popular:',
            list: ['Moscow', 'Siem Reap', 'Hanoi','Ho Chi Minh']
            }
        });
        this.$broadcast('setDefaults',{target:'finish-place', data:{
            title:'Most popular:',
            list: ['Moscow', 'Siem Reap', 'Hanoi','Ho Chi Minh']
            }
        });

        this.$broadcast('eSetPresets',{target:'startpoint', data: {'title':'Most popular:', 'list':dataSource.presetsList}});
        this.$broadcast('eSetPresets',{target:'finishpoint', data: {'title':'Most popular:', 'list':dataSource.presetsList}});
    },
    events:{
        eUpdateFormData:function(e){
            var self = this;
            if(Array.isArray(e)){
                console.log('Got array!');
                e.forEach(function(v){
                    self.formData[v.mark]=v.cvalue;
                });
            } else {
                this.formData[e.mark]=e.cvalue;
            }
            console.log(JSON.stringify(this.formData))
        
        }
    }
});
