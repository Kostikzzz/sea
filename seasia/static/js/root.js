



//======================================================
var clicks={};

var dataSource={
    testcb:[{caption:'QWertu', status:'on'},{caption:'fsese', status:'off'}],
    activities: [
        {caption:'Beach', status:'off', mark:'rtBch'},
        {caption:'Nature', status:'off', mark:'rtNat'},
        {caption:'History', status:'off', mark:'rtHst'},
        {caption:'Culture', status:'off', mark:'rtClt'},
        {caption:'Food', status:'off', mark:'rtFod'},
        {caption:'Kids', status:'off', mark:'rtKid'},
        {caption:'Nightlife', status:'off', mark:'rtNlf'}
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
        {id:23, name: 'Ho Chi Minh'},
        {id:28, name: 'Phnom Penh'},
        {id:29, name: 'Singapore'},
        {id:51, name: 'Phuket'},

    ]
};

//===============================

new Vue ({
    el:'body',
    data:{
        formData:{},
        results:[]
    },
    methods:{
        loadResults:function(){
            var self = this;
            getResults('/', 'json', {action:'loadResults', data:this.formData}, function(res){
                if (res.status=='ok'){
                    //console.log(JSON.stringify(res.results));
                    self.results=res.results;
                } else if (res.status=='unknown'){
                    alert('Status unknown. Action '+res.action);
                }
            });
        }
    },
    ready:function(){
        //setTimeout(function(){location.reload()},1000*60*30);
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
        this.$broadcast('eSetValue',{target:'activitiesGroup', data: dataSource.activities});
        this.$broadcast('eSetValue',{target:'countriesGroup', data: dataSource.countries});
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

            this.loadResults();
        },
        eInitFormData:function(e){
            var self = this;
            if(Array.isArray(e)){
                console.log('Got array!');
                e.forEach(function(v){
                    self.formData[v.mark]=v.cvalue;
                });
            } else {
                this.formData[e.mark]=e.cvalue;
            }
            //console.log('FD LENGTH: '+Object.keys(this.formData).length);
            if (Object.keys(this.formData).length>=19){
                this.loadResults();
            }
            
        }
    }
});
