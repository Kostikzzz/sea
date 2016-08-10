/*
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
*/

Vue.directive('click-outside', {
    bind:function() {
        var self  = this;
        this.event = function (event) {
            self.vm.$emit(self.expression, event);
        }
        this.el.addEventListener('click', this.stopProp);
        document.body.addEventListener('click', this.event);
    },

    unbind:function() {
        this.el.removeEventListener('click', this.stopProp);
        document.body.removeEventListener('click', this.event);
    },

    stopProp:function(event){
        event.stopPropagation()
    }
});
//===========================================================



// ADMIN COMPONENTS ***********************************************


// COMPONENT C-BUTTON ==================================================================

var cButton = Vue.extend({
    props:['mark', 'generate', 'wrap'],
    methods:{
        emitEvent:function(){
            this.$dispatch(this.generate, {emitter:this.mark});
        }
    },
    template:'<button class="c-button btn {{wrap}}" v-on:click="emitEvent"><slot></slot></button>'
});

Vue.component('c-button',cButton);


// COMPONENT C-INPUT ==================================================================

var cInput = Vue.extend({

    props:{
        'mark':String,
        'caption':String,
        'wrap':String,
        'size':Number,
        'max':Number,
        'default':[String, Number]
    },

    data:function(){
        return {
            text:''
        };
    },

    methods:{

        // COMMON METHODS
        _submit:function(){
            this.$dispatch('eUpdateFormData',{'mark':this.mark, cvalue:this.text });
        },
        _reset:function(){
            if (this.default){
                this.text=this.default;
            } else {
                this.text='';
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
                this._submit();
            }
        },
        eResetToDefaults:function(e){
            if (e.target==this.mark){
                this._reset();
                this._submit();
            }
            
        },
        eResetAll:function(){
            this._reset();
            this._submit();
        }

    },

    template:'<div class="c-input {{wrap}}" >\
                <label>{{caption}}<input v-on:click="" v-on:keyup="uiKeyUp" v-model="text" maxlength="{{max}}" size="{{size}}" type="text" class="form-control"/></label>\
                </div>'

});

Vue.component('c-input', cInput);


// COMPONENT C-RATING ==================================================================

var cRating=Vue.extend({
    props:['wrap', 'caption', 'mark', 'default'],

    data:function(){
        return {
            rating: 0
        };
    },

    methods:{

        _submit:function(){
            this.$dispatch('eUpdateFormData',{'mark':this.mark, cvalue:this.rating });
        },

        _reset:function(){
            console.log('rating reset');
            if (this.default){
                this.rating = parseInt(this.Default, 10);
            }
            else{
                this.rating = 0;
            }
            //Vue.nextTick(this._submit);
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
        },
        eResetAll:function(){
            this._reset();
            this._submit();
            /*if (this.default){
                this.rating=parseInt(this.default);
            } else {
                this.rating = 0;
            }*/
            //Vue.nextTick(this._submit());
        },
        eResetToDefaults:function(e){
            if (e.target==this.mark) {
                this.$emit('eResetAll');
            }
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

    props:['mark', 'caption', 'wrap', 'datasource', 'domid'],

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
            this.selectedValue.text=this.txt;//EXACT TEXT INPUT VALUE - NOT SENT!!!
            this.$dispatch('eUpdateFormData',[{'mark':this.mark[0], cvalue:this.selectedValue.id},{'mark':this.mark[1], cvalue:this.selectedValue.name}]);
        },

        _reset:function(){
            if (this.default){
                this.selectedValue=this.default;
                this.txt=this.default.name;
            } else {
                this.txt = '';
                this.selectedValue={id:-1};
            }
            //Vue.nextTick(this._submit());
        },

        // DROPDOWN SHOW-HIDE
        uiShowDropdown:function(){
            if ( (this.showingAc && this.autocomplete.length>0) || (!this.showingAc && this.presets.list.length>0) ){
               this.show_dd=true;
            }
        },

        hideDropdown:function(){
            this.show_dd=false;
            $('#'+this.domid).trigger('blur');
        },

        // ON KEYUP
        uiCheckAc:function(e){

            var self=this;
            var len;
            len = this.showingAc ? this.autocomplete.length : this.presets.list.length;
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
                //this.preSelected = this.preSelected >= len ? 0 : true;
            } else if (e.keyCode==38){
                this.preSelected--;
                this.preSelected<0 ? this.preSelected=len-1 : true;
                //this.preSelected = this.preSelected<0 ? len-1 : true;
            } else if (this.txt.length>=2){
                getResults(this.datasource,'json',{action:'getAutocomplete', string: this.txt}, function(res){
                    if (res.status=='ok'){
                        self.autocomplete = res.data;
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
                this.txt=this.presets.list[i].name;
                this.selectedValue = this.presets.list[i]
            } else {
                this.txt=this.autocomplete[i].name;
                this.selectedValue=this.autocomplete[i];
            }
            var self=this;
            Vue.nextTick(function(){
                self.show_dd=false;
                //self.selectedValue=self.autocomplete[i];
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
            console.log('GOT IT');
            if (e.target==this.domid){

                this.presets=e.data;
            }
        },
        eSetValue:function(e){
            if (inArray(e.target, this.mark)){
                var pos = this.mark.indexOf(e.target);
                if(pos==0){
                    this.selectedValue.id=e.data;
                    console.log('caught ID '+e.data);
                } else if (pos==1){
                    this.selectedValue.name=e.data;
                    console.log('caught NAME '+e.data);
                    this.txt = e.data;
                }
                this._submit();
            }
        }, 
        eResetAll:function(){
            this._reset();
            this._submit()
        },
        eResetToDefaults:function(e){
            if (e.target==this.domid){
                this._reset();
                this._submit();
            }
        }
    },
    
    template:'<div class="c-ac-input {{wrap}}">\
                <label for="{{domid}}">{{caption}}</label> \
                <input id="{{domid}}" class="form-control" v-bind:class="{\'has-dropdown\':show_dd}" type="text" v-on:click.stop="uiShowDropdown" v-model="txt"  v-on:focus="uiShowDropdown" v-on:keyup="uiCheckAc"  /> \
                <div v-show="show_dd" class="ac-dropdown" v-click-outside="eCustomClickOutside"> \
                    <div v-if="!showingAc">\
                        <div class="ac-dropdown-header">{{presets.title}}</div>\
                        <div class="ac-dropdown-item" v-for="l in presets.list" v-on:click="uiAcSelect($index)"><span>{{l.name}}</span></div> \
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

    props:['cbtxt', 'mark', 'wrap', 'status', 'parent'],

    data:function(){
        return ({
            checked: false,
            msg:'unchecked'           
        });
    },

    methods:{
        _submit:function(){
            this.$dispatch('eUpdateFormData',{cvalue:this.checked, parent:this.parent, mark:this.mark})
        },
        _reset:function(){
            this.setStatus(this.status);
        },
        toggle:function(){
            this.checked=!this.checked;
            if (this.checked){
                this.msg = 'check'
            } else {
                this.msg = 'unchecked'
            }
            clicks[this.mark]=this.checked;
            this._submit();
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
            this._submit();
        },

    },
    created: function(){
        this.setStatus(this.status)
    },
    events:{
        'eSetValue':function(e){
            if (e.target==this.mark){
                this.setStatus(e.data);
            }
            this._submit();
        },
        'eResetAll':function(){
            this._reset();
            this._submit();
        },
        'eResetToDefaults':function(){
            if (e.target==this.mark){ this._reset(); this._submit()}
        }
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
            dataList:[],
            groupData:{}
        }
    },
    methods:{
        _submit:function(){
            this.$dispatch('eUpdateFormData',{mark:this.mark, cvalue:this.groupData, parent:this.parent})
        },
        setAllValues: function(){
            var self = this;
            this.dataList.forEach(function(d){
                self.$broadcast('eSetValue',{target:d.mark, data:d.status});
            });
        },
        setAllTo:function(v){
            var self = this;
            this.dataList.forEach(function(d){
                d.status=v;
            });
            this.setAllValues();
        }
    },
    props:['mark', 'wrap', 'parent'],
    events:{
        'eSetValue':function(e){
            if(e.target==this.mark){
                this.dataList=e.data;
                this.setAllValues();
                this._submit();
            }
        },
        'eUpdateFormData':function(e){
            if (e.parent==this.mark){
                this.groupData[e.mark] = e.cvalue;
                console.log(JSON.stringify(this.groupData));
                this._submit();
            }
        }
    },
    
    template:'<div class="c-cb-list {{wrap}}"><div class="c-cb-list__select-all">\
                select: <span class="plink" v-on:click="setAllTo(\'on\')">all</span> | <span class="plink" v-on:click="setAllTo(\'off\')">none</span>\
            </div>\
                \
            <template v-for="cb in dataList" >\
            <c-checkbox v-bind:cbtxt="cb.caption" v-bind:status="cb.status" v-bind:mark="cb.mark" :parent="mark"></c-checkbox>\
            </template></div>'
});

Vue.component('c-cb-list', cCbList);




// COMPONENT C-DURATION ==================================================================

var cDuration = Vue.extend({

// C-DURATION -- PARAMS . . . . . . . . . . . . . . . . . . . . . . . . . . 
    props:['wrap', 'def', 'mark', 'min'],

    // C-DURATION -- DATA . . . . . . . . . . . . . . . . . . . . . . . . . . 
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

    // C-DURATION -- METHODS . . . . . . . . . . . . . . . . . . . . . . . . . . 
    methods:{
        _reset:function(){
            console.log('reseting '+this.mark);
            if (this.def != undefined){
                this.number=this.def[0];
                this.measure=this.def[1];
            }
            else{
                this.number=7;
                this.measure='days'
            }
        },
        _submit:function(){
            this.$dispatch('eUpdateFormData',{mark:this.mark, cvalue: this.measure=='days' ? this.number : this.number*7})
        },
        inc: function(){
            this.number++;
            this._submit();
        },
        dec:function(){
            if (this.min && this.number>this.min){
                this.number--;
            }
            
            this._submit();
        },
        setDays:function(){
            if (this.measure=='weeks'){
                this.oldWeeksNumber=this.number;
                this.measure='days';
                this.daysToggle='c-duration__selected';
                this.weeksToggle='';
                this.number=this.oldDaysNumber;
            }
            this._submit();
        },
        setWeeks:function(){
            if (this.measure=='days'){
                this.oldDaysNumber=this.number;
                this.measure='weeks';
                this.daysToggle='';
                this.weeksToggle='c-duration__selected';
                this.number=this.oldWeeksNumber;
            }
            this._submit();
        }
    },

    // C-DURATION -- CREATED . . . . . . . . . . . . . . . . . . . . . . . . . . 
    created:function(){
        this._reset();
        this._submit();
    },

    // C-DURATION -- TEMPLATE . . . . . . . . . . . . . . . . . . . . . . . . . . 
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

//  COMPONENT C-DUAL-TOGGLE ================================================================================================

var cDualToggle=Vue.extend({

    // C-DUAL-TOGGLE -- DATA . . . . . . . . . . . . . . . . . . . . . . . . . . 
    data: function(){
        return {
            opt1:'c-dual-toggle__selected',
            opt2:''
        }
    },

    // C-DUAL-TOGGLE -- PROPS . . . . . . . . . . . . . . . . . . . . . . . . . . 
    props: ['caption1','caption2', 'mark', 'status', 'wrap'],
    data:function(){
        return{
            state:0,
            opt1:'',
            opt2:''
        }
    },
    methods: {
        _submit:function(){
            this.$dispatch('eUpdateFormData', {mark:this.mark, cvalue:this.state});
        },
        selectOpt:function(v){
            if (v=="0"){
                this.opt1='c-dual-toggle__selected';
                this.opt2='';
                this.state=0;
            } else if (v=="1"){
                this.opt1='';
                this.opt2='c-dual-toggle__selected';
                this.state=1;
            }
            this._submit();
        }
    },

    // C-DUAL-TOGGLE -- CREATED . . . . . . . . . . . . . . . . . . . . . . . . . . 
    created:function(){
        if (this.status!=undefined){this.selectOpt(this.status)}
        else {this.selectOpt("0")}
    },
    template:'<div class="c-dual-toggle {{wrap}}">\
                <span class="c-dual-toggle__option c-dual-toggle__left-option" v-on:click="selectOpt(0)" v-bind:class="[opt1]">{{caption1}}</span>\
                <span class="c-dual-toggle__option c-dual-toggle__right-option" v-on:click="selectOpt(1)" v-bind:class="[opt2]">{{caption2}}</span>\
             </div>'

});

Vue.component('c-dual-toggle', cDualToggle);

//  COMPONENT C-GRID ================================================================================================

Vue.component('c-grid', {

    // C-GRID -- PROPS . . . . . . . . . . . . . . . . . . . . . . . . . . 
    props: {
        filterKey: String,
        mark: String
    },

    // C-GRID -- DATA . . . . . . . . . . . . . . . . . . . . . . . . . . 
    data: function () {
        return {
            sortKey: '',
            so:1,
            data: [
                { name: 'Chuck Norris', power: Infinity },
                { name: 'Bruce Lee', power: 9000 },
                { name: 'Jackie Chan', power: 7000 },
                { name: 'Jet Li', power: 8000 }
            ],
            columns:['name', 'power']
        }
    },

    // C-GRID -- METHODS . . . . . . . . . . . . . . . . . . . . . . . . . . 
    methods: {
        sortBy: function (key) {
            this.sortKey = key;
            this.so=this.so*-1;
        },
        makeSortOrders: function(){
            this.sortOrders={};
            var self=this;
            this.columns.forEach(function (key) {
                self.sortOrders[key] = 1
            });
        },
        dispatchDblClick:function(i){
            this.$dispatch('eTableDblClick', {emitter:this.mark, data:i['id']})
        }
    },

    // C-GRID -- EVENTS . . . . . . . . . . . . . . . . . . . . . . . . . . 
    events:{
        eSetValue:function(e){
            if (e.target==this.mark){
                this.data=e.data.tableData;
                this.columns = e.data.tableColumns;
            }
        }
    },

    // C-GRID -- TEMPLATE . . . . . . . . . . . . . . . . . . . . . . . . . . 
    template: ' <div class="c-grid"><table>\
                <thead>\
                  <tr>\
                    <th v-for="key in columns"\
                      v-on:click="sortBy(key)"\
                      :class="{active: sortKey == key}">\
                      {{key | capitalize}}\
                      <span class="arrow" v-if="sortKey == key"\
                        :class="so > 0 ? \'asc\' : \'dsc\'">\
                      </span>\
                    </th>\
                  </tr>\
                </thead>\
                <tbody>\
                  <tr v-for="entry in data | filterBy filterKey | orderBy sortKey so" v-on:dblclick="dispatchDblClick(entry)">\
                    <td v-for="key in columns">\
                      {{entry[key]}}\
                    </td>\
                  </tr>\
                </tbody>\
              </table></div>'
});

//  COMPONENT C-ORDERED-LIST ================================================================================================

var cOrderedList = Vue.extend({
    props:['mark', 'wrap'],
    data:function(){
        return {
            dataList:[],
            textList:[]
        }
    },
    methods:{
        _submit:function(){
            this.$dispatch('eUpdateFormData',{mark:this.mark, cvalue:this.dataList});
        },
        _reset:function(){
            this.dataList=[];
            this.textList=[];
        },
        dataToText:function(){
            this.textList=[];
            for (n=0; n<this.dataList.length; n++){
                console.log(n);
                //replace with callback
                this.textList.push(this.dataList[n].text);
            }
            console.log(JSON.stringify(this.textList));
        },
        moveUp:function(i){
            if (i>0){
                var x=this.dataList[i-1];
                this.dataList[i-1]=this.dataList[i];
                this.dataList[i]=x;
                this.dataToText();
                this._submit();
            }
        },
        moveDn:function(i){
            var l=this.dataList.length;
            if (i<l-1){
                var x=this.dataList[i+1];
                this.dataList[i+1]=this.dataList[i];
                this.dataList[i]=x;
                this.dataToText();
                this._submit();
            }
        },
        deleteItem:function(i){
            this.dataList.splice(i,1);
            this.dataToText();
            this._submit();
        }
    },
    created:function(){
        this.dataToText();
    },

    events:{
        'eAddNewPoint':function(e){
            this.dataList.push(e.data);
            this.dataToText();
            this._submit();
            console.log(JSON.stringify(this.dataList));
        },
        'eResetAll':function(){
            this._reset();
            this._submit();
        },
        'eResetToDefaults':function(e){
            if (e.target==this.mark){
                this._reset();
                this._submit();
            } 
        },
        eSetValue:function(e){
            if (e.target==this.mark){
                console.log('GOT THE EVENT');
                this.dataList=e.data;
                console.log(JSON.stringify(e.data));
                this.dataToText();
                this._submit();
            }
        }
    },

    template:'<table class="c-ordered-list">\
                <tr class="c-ordered-list__item" v-for="item in textList" track-by="$index"><td>{{item}}</td>\
                    <td class="c-ordered-list__item-cmdbar">\
                        <span @click="moveUp($index)" class="glyphicon glyphicon-chevron-up"></span>\
                        <span @click="moveDn($index)" class="glyphicon glyphicon-chevron-down"></span>\
                        <span @click="deleteItem($index)">X</span>\
                    </td>\
                </tr>\
            </table>'
});

Vue.component('c-ordered-list', cOrderedList);

