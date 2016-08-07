var formOpCaption = {'add':'Add new point','edit':'Edit point'};
var form = [
    {group:1,col:4, elements:[
        {mark: ['geoId','geoName'], type:'ac-input'},
        {mark: 'pointName', type:'input', default:""}
        ]
    },
    {group:2,col:4, elements:[
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
    {group:3,col:4, elements:[
        {mark: 'pointPop', type:'input', default:"1"},
        {mark: 'absMin', type:'input', default:"1"},
        {mark: 'recMin', type:'input', default:"0"},
        {mark: 'recMax', type:'input', default:"0"},
        {mark: 'absMax', type:'input', default:"0"}
        ]
    }
];

var dataSource = '/admin/points';

