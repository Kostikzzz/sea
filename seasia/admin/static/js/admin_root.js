var adminRoot = new Vue({
    el:'#main-container',
    data: {
        searchQuery: ''
      },
    template: '<div id="demo">\
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
                    //self.tableData = res.tableData;
                    //self.tableColumns = res.tableColumns;
                    self.$broadcast('eSetValue', {target:'tablePoints', data:{tableData:res.tableData, tableColumns:res.tableColumns}})
                    console.log(JSON.stringify(res.tableData));
                }
            });
        }
    },
    created:function(){
        this.loadTableData();
    }
});