



//======================================================
var clicks={};

var dataSource={
    testcb:[{caption:'QWertu', status:'on'},{caption:'fsese', status:'off'}],
    activities: [
        {caption:'Beach', status:'on', mark:'rtBch'},
        {caption:'Nature', status:'off', mark:'rtNat'},
        {caption:'History', status:'on', mark:'rtHst'},
        {caption:'Culture', status:'off', mark:'rtClt'},
        {caption:'Food', status:'off', mark:'rtFod'},
        {caption:'Kids', status:'off', mark:'rtKid'},
        {caption:'Nightlife', status:'off', mark:'rtNlf'},
        {caption:'Diving', status:'off', mark:'rtDiv'},
        {caption:'Shopping', status:'off', mark:'rtShp'}
    ],
    countries:[
        {caption:'Thailand', status:'on', mark:'thailand'},
        {caption:'Myanmar', status:'on', mark:'myanmar'},
        {caption:'Laos', status:'on', mark:'laos'},
        {caption:'Vietnam', status:'on', mark:'vietnam'},
        {caption:'Cambodia', status:'on', mark:'cambodia'},
        {caption:'Malaysia', status:'on', mark:'malaysia'},
        {caption:'Singapore', status:'on', mark:'singapore'}
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
        results:[],
        collapsed: true,
        hasResults: false,
        adventures:[]
    },
    methods:{
        loadResults:function(){
            var self = this;
            getResults('/', 'json', {action:'loadResults', data:this.formData}, function(res){
                if (res.status=='ok'){
                    //console.log(JSON.stringify(res.adventures));
                    self.results=res.results;
                    self.adventures = shuffle(res.adventures);
                    self.hasResults = self.results.length>0 ? true : false;
                } else if (res.status=='unknown'){
                    alert('Status unknown. Action '+res.action);
                }
            });
        },
        toggleCollapsed:function(){
            var self = this;
            this.collapsed = !this.collapsed;
            //console.log('collapsed: '+ this.collapsed);
            this.results.forEach(function(r){
                r.collapsed = self.collapsed;
            });
        },
        toggleThis:function(i){
            this.results[i].collapsed=!this.results[i].collapsed;
        }
    },
    ready:function(){
        setTimeout(function(){location.reload()},1000*60*5);
        /*this.$broadcast('setDefaults',{target:'start-place', data:{
            title:'Most popular:',
            list: ['Moscow', 'Siem Reap', 'Hanoi','Ho Chi Minh']
            }
        });
        this.$broadcast('setDefaults',{target:'finish-place', data:{
            title:'Most popular:',
            list: ['Moscow', 'Siem Reap', 'Hanoi','Ho Chi Minh']
            }
        });*/
        this.$broadcast('eSetValue',{target:'activitiesGroup', data: dataSource.activities});
        this.$broadcast('eSetValue',{target:'countriesGroup', data: dataSource.countries});
        /*this.$broadcast('eSetPresets',{target:'startpoint', data: {'title':'Most popular:', 'list':dataSource.presetsList}});
        this.$broadcast('eSetPresets',{target:'finishpoint', data: {'title':'Most popular:', 'list':dataSource.presetsList}});*/

        //this.$broadcast('eForceSubmit')
        //$('.help-sign').tooltip();
        this.loadResults();
    },
    events:{
        eUpdateFormData:function(e){
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>eUpdateFormData');
            if (!e.parent){
                var self = this;
                if(Array.isArray(e)){
                    //console.log('Got array!');
                    e.forEach(function(v){
                        self.formData[v.mark]=v.cvalue;
                    });
                } else {
                    this.formData[e.mark]=e.cvalue;
                }
                if (e.toServer){
                    this.loadResults();
                }

            }
        }

/*        eInitFormData:function(e){
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>eInitFormData');
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+e.mark);

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

        }*/
    }
});
