var adminRoot = new Vue({
    el:'#main-container',
    data: {
        searchQuery: '',
        showEditForm:false,
        formOp:null,
        formOpCaption:{'add':'Add new point','edit':'Edit point'},
        form: [
            {group:1,col:3, elements:[
                {mark: 'geopointAc', type:'ac-input'},
                {mark: 'pointName', type:'input'}
                ]
            },
            {group:2,col:3, elements:[
                {mark: 'rtBch', type:'rating'},
                {mark: 'rtHst', type:'rating'},
                {mark: 'rtNat', type:'rating'},
                {mark: 'rtDiv', type:'rating'},
                {mark: 'rtShp', type:'rating'},
                {mark: 'rtKid', type:'rating'},
                {mark: 'rtClt', type:'rating'},
                {mark: 'rtFod', type:'rating'},
                {mark: 'rtNlf', type:'rating'}
                ]
            },
            {group:3,col:3, elements:[
                {mark: 'pointPop', type:'input'},
                {mark: 'absMin', type:'input'},
                {mark: 'recMin', type:'input'},
                {mark: 'recMax', type:'input'},
                {mark: 'absMax', type:'input'}
                ]
            }
        ]
      },
    template: '<div id="demo">\
                <div id="toolbar"><button class="btn btn-xs btn-warning" v-on:click="addNew">+ ADD NEW</button></div>\
                \
                <div v-show="showEditForm" id="editFormPlace">\
                    <h2>{{formOpCaption[formOp]}}</h2>\
                    \
                    <div class="row">\
                        <template v-for="g in form">\
                            <div class="col-lg-{{g.col}}">\
                                <template v-for="e in g.elements">\
                                    <c-ac-input v-if="e.type==\'ac-input\'" :mark="e.mark" :caption="e.mark"></c-ac-input>\
                                    <c-input v-if="e.type==\'input\'" :mark="e.mark" :caption="e.mark"></c-input>\
                                    <c-rating v-if="e.type==\'rating\'" :mark="e.mark" :caption="e.mark"></c-rating>\
                                </template>\
                            </div>\
                        </template>\
                    </div>\
                    \
                    <div class="row">\
                        <div class="col-lg-3">\
                            <button class="btn btn-large btn-success" style="width:100%">CANCEL</button>\
                        </div>\
                        <div class="col-lg-3 col-lg-offset-6">\
                            <button class="btn btn-large btn-warning" style="width:100%">SUBMIT</button>\
                        </div>\
                    </div>\
                </div>\
                \
                <form id="search">\
                    Search <input name="query" v-model="searchQuery">\
                </form>\
                  <c-grid mark="tablePoints"\
                    :filter-key="searchQuery">\
                  </c-grid>\
                </div>',

    methods:{
        loadTableData:function(){
            var self = this;
            getResults('/adminka', 'json', {action:"getTableData"}, function(res){
                if (res.status=='ok'){
                    self.$broadcast('eSetValue', {target:'tablePoints', data:{tableData:res.tableData, tableColumns:res.tableColumns}})
                    console.log(JSON.stringify(res.tableData));
                }
            });
        },
        addNew:function(){
            this.formOp='add';
            this.showEditForm=true;
        },
        editEntry:function(e){
            this.formOp='edit';
            this.showEditForm=true;
        }
    },
    created:function(){
        this.loadTableData();
    },
    events:{
        eTableDblClick:function(e){
            console.log('dblclick with '+e.data+' from '+e.emitter);
            this.editEntry(e.data);
        }
    }
});