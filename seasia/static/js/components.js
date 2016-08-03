
Vue.directive('click-outside', {
  bind () {
    let self  = this
    this.event = function (event) { 
      self.vm.$emit(self.expression, event) 
    }
    this.el.addEventListener('click', this.stopProp)
    document.body.addEventListener('click', this.event)
  },

  unbind() {
    this.el.removeEventListener('click', this.stopProp)
    document.body.removeEventListener('click', this.event)
  },

  stopProp(event) { event.stopPropagation() }
})
//===========================================================



// ADMIN COMPONENTS ***********************************************


// C-SCREEN COMPONENT ================================

var cScreen = Vue.extend({
    props:['mark','caption','wrap', 'datasource','type'],
    data:function(){
        return {
            active:false,
            componentsData:{},
            state:{}
        }
    },
    methods:{
        _reset:function(){
            this.componentsData={};
            state:{}
            active:false;
            this.$broadcast('eResetAll');
        },
        preloadData:function(dataID, callback){
            var self = this;
            getResults('/'+this.datasource, 'json', {op:'getValues', tid:this.mark, 'dataID':dataID}, function(res){
                if (res.status=='ok'){
                    res.fields.forEach(function(f){
                        var param = {target:f.field, data:f.data}
                        self.$broadcast('eSetValue',param );
                    });
                    Vue.nextTick(callback());
                }
            });
        }
    },
    events:{
        'eActivateScreen':function(e){
            var self = this;
            if (e.target==this.mark){
                
                if(e.cmd && e.cmd.op=="edit"){
                    self._reset();
                    self.active =  true;
                    this.preloadData(e.cmd.id, function(){
                         self.state = {op:e.cmd.op, id:e.cmd.id};
                    });

                }else{
                    this._reset();
                    this.active = true;
                }
               
            } else {
                this._reset;
                this.active = false;
            }
        },
        'updateFormData':function(e){
            this.componentsData[e.mark]=e.cvalue;
            console.log(JSON.stringify(this.componentsData));
            // ADMIN EXT
            if (e.mark=='geopointAc'){
                this.$broadcast('eSetValue',{target:'pointName', data:e.cvalue.name});
            }
            // 
        },
        eSubmitFormData:function(){
            var self = this;
            if (this.state.op=="edit"){
                getResults('/'+this.datasource, 'json', {op:'saveEdited', tid:this.mark, 'dataID':this.state.id, fields:this.componentsData}, function(res){
                    if (res.status=='ok'){

                    }
                });
            }
            
        }
    },
    template: '<div class="c-screen {{wrap}}" v-show="active">\
              <slot></slot> </div>\
                </div>'
});

Vue.component('c-screen', cScreen);



// C-TABLE COMPONENT =================================
var cTable = Vue.extend({
    props:['mark', 'datasource','renew'],

    data:function(){
        return{
            tableRows:[],
            tableHeader:[],
            loaded:false
        }
    },
    
    methods:{
        _reset:function(){
            var self=this;
            if ((this.renew=="oneTime" && !this.loaded) || (this.renew!="oneTime")){
                getResults('/'+this.datasource, 'json', {cmd:'getTable', tid:this.mark}, function(res){
                    if (res.status='ok'){
                        self.tableRows= res.tableRows;
                        self.tableHeader = res.tableHeader;
                        Vue.nextTick(function(){
                            $('#'+self.mark).tablesorter();
                        });
                    } else {
                        console.log('There was an error loading table data');
                    }
                });
            }

        },
        uiEditThisEntry:function(i){
            this.$dispatch('eTableDblclick',{emitter:this.mark, data:this.tableRows[i]});
        }
    },

    events:{
        eResetAll:function(){
            this._reset();
        },
        'eResetToDefaults':function(e){
            if (e.target==this.mark) this._reset();
        }
    },

    template:'  <div class="c-table">\
                <table id="{{mark}}" class="tablesorter">\
                <thead>\
                    <tr>\
                        <th v-for="h in tableHeader">{{h}}</th>\
                    </tr>\
                </thead>\
                <tbody>\
                    <tr v-for="r in tableRows" v-on:dblclick="uiEditThisEntry($index)"><td v-for="f in r">{{f}}</td></tr>\
                </tbody>\
            </table></div>'
});

Vue.component('c-table', cTable);





// COMPONENT C-BUTTON ==================================================================

var cButton = Vue.extend({
    props:['mark', 'generate', 'wrap'],
    methods:{
        emitEvent:function(){
            this.$dispatch(this.generate, {emitter:this.mark})
        }
    },
    template:'<button class="c-button btn {{wrap}}" v-on:click="emitEvent"><slot></slot></button>'
});

Vue.component('c-button',cButton);


// COMPONENT C-INPUT ==================================================================

var cInput = Vue.extend({

    props:['mark', 'caption', 'wrap', 'size', 'max', 'default'],

    data:function(){
        return {
            text:''
        }
    },

    methods:{

        // COMMON METHODS
        _submit:function(){
            this.$dispatch('updateFormData',{'mark':this.mark, cvalue:this.text });
        },
        _reset:function(){
            if (this.default){
                this.text=this.default;
                Vue.nextTick(this._submit());
                console.log('>input reset')
            }
        },

        // SPECIFIC METHODS
        uiKeyUp:function(e){
                this._submit();
        }
    },

    created:function(){
        this._reset();
    },

    events:{

        eSetValue:function(e){
            if (e.target==this.mark){
                this.text = e.data;
                Vue.nextTick(this._submit());
            }
        },        
        eResetToDefaults:function(e){
            if (e.target==this.mark){
                this._reset();
                Vue.nextTick(this._submit());
            }
            
        },
        eResetAll:function(){
            
            this._reset();
            Vue.nextTick(this._submit());
        }

    },

    template:'<div class="c-input {{wrap}}" ><label>{{caption}}<input v-on:click="" v-on:keyup="uiKeyUp" v-model="text" maxlength="{{max}}" size="{{size}}" type="text" class="form-control"/></label></div>'

});

Vue.component('c-input', cInput);


// COMPONENT C-RATING ==================================================================

var cRating=Vue.extend({
    props:['wrap', 'caption', 'mark', 'default'],

    data:function(){
        return {
            rating: 0
        }
    },

    methods:{

        _submit:function(){
            this.$dispatch('updateFormData',{'mark':this.mark, cvalue:this.rating });
        },

        _reset:function(){
            console.log('rating reset');
            if (this.default){
                this.rating = parseInt(this.Default);
            }
            else{
                this.rating = 0;
            }
            Vue.nextTick(this._submit);
        },

        uiSetRating:function(i){
            this.rating=i;
            console.log(i);
            Vue.nextTick(this._submit);
        }

    },

    created:function(){
        this._reset();
    },

    events:{
        eSetValue:function(e){
            if (e.target==this.mark) this.rating = e.data;
            Vue.nextTick(this._submit);
        }
    },
    
    template:'<div class="c-rating {{wrap}}" id="{{mark}}">\
                <label>{{caption}}<br/>\
                <div class="c-rating__block" v-bind:class="{\'c-rating__block--selected\': $index<=rating&&$index>0}" v-for="n in 6" v-on:click="uiSetRating($index)">{{$index}}</div>\
                </label>\
            </div>'

});

Vue.component('c-rating', cRating);


// COMPONENT C-AC-INPUT ==================================================================

var cAcInput=Vue.extend({

    props:['mark', 'caption', 'wrap', 'datasource'],

    data:function(){
        return ({
          txt:'',
          show_dd:false,
          presets:{
            list:[]
          },
          showingAc:false,
          autocomplete:[],
          selectedValue:{id:-1},
          preSelected:-1
        });
    },

    methods:{

        _submit:function(){
            this.hideDropdown();
            this.selectedValue.text=this.txt;
            this.$dispatch('updateFormData',{'mark':this.mark, cvalue:this.selectedValue});
        },

        _reset:function(){
            if (this.default){
                this.selectedValue=this.default;
                this.txt=this.default.name;
            } else {
                this.txt = '';
                this.selectedValue={id:-1};
            }
            Vue.nextTick(this._submit());
        },

        // DROPDOWN SHOW-HIDE
        uiShowDropdown:function(){
            if ( (this.showingAc && this.autocomplete.length>0) || (!this.showingAc && this.presets.list.length>0) ){
               this.show_dd=true; 
            } 
        },

        hideDropdown:function(){
            this.show_dd=false;
            $('#'+this.mark).trigger('blur');            
        },

        // ON KEYUP
        uiChackAc:function(e){

            var self=this;            
            var len;
            this.showingAc ? len = this.autocomplete.length : len = this.presets.list.length;
            if (e.keyCode==13){
                if(this.preSelected==-1){
                    this._submit();
                }
                else{
                    this.uiAcSelect(this.preSelected);
                }
            } else if (e.keyCode==27) {
                this.hide();
            } else if (e.keyCode==40){
                this.preSelected++;
                this.preSelected>=len ? this.preSelected=0 : true;
            } else if (e.keyCode==38){
                this.preSelected--;
                this.preSelected<0 ? this.preSelected=len-1 : true;
            } else if (this.txt.length>=2){
                getResults('/'+this.datasource,'json',{cmd  :'getAutocomplete', string: this.txt}, function(res){
                    if (res.status=='ok'){
                        self.autocomplete = res.geos;
                        self.showingAc=true;
                        self.uiShowDropdown();
                    }
                });
            } else {
                this.showingAc=false;
            }
        },

        // ON SELECT FROM DROPDOWN
        uiAcSelect:function(i){
            if (!this.showingAc){
                this.txt=this.presets.list[i];
                
            } else {
                this.txt=this.autocomplete[i].name;
            }
            var self=this;
            Vue.nextTick(function(){
                self.show_dd=false;
                self.selectedValue=self.autocomplete[i];
                self._submit();
            });
            
        }

    },

    events:{
        // CUSTOM EVENT FOR CLICK OUTSIDE
        eCustomClickOutside:function(){
            this.hideDropdown();
        },
        eSetPresets:function(e){
            if (e.target==this.mark){
                this.presets=e.data;
            }
        },
        eSetValue:function(e){
            if (e.target==this.mark){
                this.selectedValue=e.data;
                this.txt = this.selectedValue.name;
            }
        }, 
        eResetAll:function(){
            this._reset();
        },
        eResetToDefaults:function(e){
            if (e.target==this.mark) this._reset();
        }
    },
    
    template:'<div class="c-ac-input {{wrap}}">\
                        <label for="{{mark}}">{{caption}}</label> \
                        <input id="{{mark}}" class="form-control" v-bind:class="{\'has-dropdown\':show_dd}" type="text" v-on:click.stop="uiShowDropdown" v-model="txt"  v-on:focus="uiShowDropdown" v-on:keyup="uiChackAc"  /> \
                        <div v-show="show_dd" class="ac-dropdown" v-click-outside="eCustomClickOutside"> \
                            <div v-if="!showingAc">\
                                <div class="ac-dropdown-header">{{presets.title}}</div>\
                                <div class="ac-dropdown-item" v-for="l in presets.list" v-on:click="uiAcSelect($index)"><span>{{l}}</span></div> \
                            </div>\
                            <div v-if="showingAc">\
                                <div class="ac-dropdown-item" v-for="l in autocomplete" v-bind:class="{\'ac-dropdown__item--preselected\':preSelected==$index}" v-on:click="uiAcSelect($index)"><span>{{l.name}}</span></div> \
                            </div>\
                        </div> \
                    </div>'
});

Vue.component('c-ac-input', cAcInput);




// USER COMPONENTS ***********************************************

// COMPONENT C-CHECKBOX ==================================================================
var cCheckbox=Vue.extend({

    props:['cbtxt', 'mark', 'wrap', 'status'],

    data:function(){
        return ({
            checked: false,
            msg:'unchecked'           
        });
    },

    methods:{
        toggle:function(){
            this.checked=!this.checked;
            if (this.checked){
                this.msg = 'check'
            } else {
                this.msg = 'unchecked'
            }
            clicks[this.mark]=this.checked;
        },
        setStatus:function(s){
            if (s=='on'){
                this.checked=true;
                this.msg="check"
            } else{
                this.checked=false;
                this.msg="unchecked"
            }
            clicks[this.mark]=this.checked;
        }
    },
    created: function(){
        this.setStatus(this.status)
    },
    
    template:'<div class="{{wrap}} c-checkbox" v-on:click="toggle">\
                <span class="c-checkbox__gi-{{msg}} glyphicon glyphicon-{{msg}}"></span>&nbsp;\
                <span class="c-checkbox-{{msg}}">{{cbtxt}}</span>\
            </div>'
});

Vue.component('c-checkbox', cCheckbox);


// COMPONENT C-CB-LIST ==================================================================
var cCbList = Vue.extend({
    data: function(){
        return {
            dataList:[]
        }
    },
    methods:{
        loadDataSource:function(){
            list=dataSource[ds]
        },
        setAll: function(s){
            for (var i=0; i<this.$children.length; i++){
                this.$children[i].setStatus(s);
            }
        }
    },
    props:['ds'],
    created: function(){
        this.dataList=dataSource[this.ds]
    },
    
    template:'<div class="c-cb-list__select-all">select: <span class="plink" v-on:click="setAll(\'on\')">all</span> | <span class="plink" v-on:click="setAll(\'off\')">none</span></div></div><template v-for="cb in dataList" > <c-checkbox v-bind:cbtxt="cb.caption" v-bind:status="cb.status" v-bind:mark="cb.mark" ></c-checkbox></template>'
});

Vue.component('c-cb-list', cCbList);




// COMPONENT C-DURATION ==================================================================

var cDuration = Vue.extend({

    data: function(){
        return {
            number: 14,
            measure:'days',
            daysToggle:'c-duration__selected',
            weeksToggle:'',
            oldDaysNumber: 14,
            oldWeeksNumber: 3
        }
    },

    methods:{

        inc: function(){
            this.number++;
        },
        dec:function(){
            this.number--;
        },
        setDays:function(){
            if (this.measure=='weeks'){
                this.oldWeeksNumber=this.number;
                this.measure='days';
                this.daysToggle='c-duration__selected';
                this.weeksToggle='';
                this.number=this.oldDaysNumber;
            }
        },
        setWeeks:function(){
            if (this.measure=='days'){
                this.oldDaysNumber=this.number;
                this.measure='weeks';
                this.daysToggle='';
                this.weeksToggle='c-duration__selected';
                this.number=this.oldWeeksNumber;
            }

        }
    },

    params:['wrap'],

    template:'<div class="c-duration {{wrap}}"><label for="days-count" >Duration</label> \
                    <div class="c-duration__body">\
                        <span v-on:click="dec" class="c-duration__pm glyphicon glyphicon-minus-sign"></span>\
                        <input  id="days-count" type="text" maxlength="3" size="3" v-model="number" class="form-control" style="" />\
                        <span v-on:click="inc" class="c-duration__pm glyphicon glyphicon-plus-sign"></span>\
                        <div class="c-duration__measure-wrapper" style="">\
                            <div class="c-duration__measure-toggle" v-bind:class="[daysToggle]" v-on:click="setDays"style="border-width: 0px 0px 1px 0px;  border-style:solid;  border-color:#888; ">Days</div>\
                            <div class="c-duration__measure-toggle" v-bind:class="[weeksToggle]" v-on:click="setWeeks" >Weeks</div>\
                        </div>\
                    </div>\
                </div>'

});

Vue.component('c-duration', cDuration);

// COMPONENT C-DUAL-TOGGLE ==================================================================

var cDualToggle=Vue.extend({
    data: function(){
        return {
            opt1:'c-dual-toggle__selected',
            opt2:''
        }
    },
    props: ['caption1','caption2', 'mark', 'status', 'wrap'],
    methods: {
        selectOpt:function(v){
            if (v=="0"){
                this.opt1='c-dual-toggle__selected';
                this.opt2='';
            } else if (v=="1"){
                this.opt1='';
                this.opt2='c-dual-toggle__selected';
            }
        }
    },
    created:function(){
        this.selectOpt(this.status);
    },
    template:'<div class="c-dual-toggle {{wrap}}">\
                <span class="c-dual-toggle__option c-dual-toggle__left-option" v-on:click="selectOpt(0)" v-bind:class="[opt1]">{{caption1}}</span>\
                <span class="c-dual-toggle__option c-dual-toggle__right-option" v-on:click="selectOpt(1)" v-bind:class="[opt2]">{{caption2}}</span>\
             </div>'

});

Vue.component('c-dual-toggle', cDualToggle);


