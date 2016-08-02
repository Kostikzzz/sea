var selectedUser={
    uid:null,
    name:'',
    messages:[],
    ban: false
}

function sendMessage(txt, uid){
    getResults('/post-messenger', 'json', {text: txt, cmd:'sendMessage', uid: id}, function(res){
        if (res.status=='ok'){
            //$('#chat').append(renderMessage(currentUser, {text:txt, sender:currentUser}));
        }
        else if(res.status=='disabled'){
            alert('Вы не можете отправлять сообщения этому пользователю')
        }
        
    });
}

function getUserData(user_id, callback){
    getResults('/post-messenger', 'json', {cmd:'loadUserData', uid: user_id}, function(res){
        selectedUser.name=res.name;
        selectedUser.messages=res.messages;
        selectedUser.ban=res.ban;
        console.log(res.messages);
        callback();
    });
}

$(document).ready(function(){
    var currentUser = $('meta[name=uid]').attr('content');

    // set reload time from server
    setTimeout(function(){location.reload()},1000*60*10);

});


var chatHeader = new Vue({
    el:'#v__chat-header',
    data:{
        headerText:''
    }
/*    methods:{
        loadText: function(){
            this.headerText=selectedUser.name;
        }
    }*/
});

var chat = new Vue({
    el:'#v__chat',
    data:{
        messages:[]
    }
});

function loadChat(){
    /*chatHeader.loadText();*/
    chatHeader.headerText=selectedUser.name;
    chat.messages = selectedUser.messages;
    $('#v__chat__placeholder').hide();
}

var contactList = new Vue({
    el: '#v__contact-list',
    data: {
        selected: null
    },
    methods:{
        selectUser: function(e){
            if (this.selected){
                $(this.selected).removeClass('v__contact-list__item--selected');
            }
            $(e.target).addClass('v__contact-list__item--selected');
            this.selected = e.target;
            selectedUser.uid=this.selected.dataset.uid;
            getUserData(selectedUser.uid, loadChat);
            
        }
    }
});