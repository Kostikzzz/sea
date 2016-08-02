
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
    ]
};




//===============================

new Vue ({
    el:'body',
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
    }
});
