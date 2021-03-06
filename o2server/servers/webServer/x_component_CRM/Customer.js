MWF.xApplication.CRM = MWF.xApplication.CRM || {};

MWF.xDesktop.requireApp("Template", "MForm", null, false);
MWF.xDesktop.requireApp("CRM", "Template", null,false);
MWF.xDesktop.requireApp("Template", "Explorer", null,false);

MWF.require("MWF.widget.Identity", null,false);
MWF.xDesktop.requireApp("Forum", "Actions.RestActions", null, false);

MWF.xApplication.CRM.Customer = new Class({
    Extends: MWF.widget.Common,
    Implements: [Options, Events],
    options: {
        "style": "default"
    },

    initialize: function (node, app, actions, options) {
        this.setOptions(options);
        this.app = app;
        this.lp = app.lp.customer;
        this.path = "/x_component_CRM/$Customer/";
        this.loadCss();

        this.actions = actions;
        this.node = $(node);
    },
    loadCss: function () {
        this.cssPath = "/x_component_CRM/$Customer/" + this.options.style + "/css.wcss";
        this._loadCss();
    },
    load: function () {
        this.testActions = new MWF.xApplication.Forum.Actions.RestActions();
        if(this.formContentArr)this.formContentArr.empty();
        this.formContentArr = [];
        if(this.formMarkArr)this.formMarkArr.empty();
        this.formMarkArr = [];

        this.rightContentDiv = this.app.rightContentDiv;
        this.createHeadContent();
        this.createToolBarContent();
        this.createCustomerContent();

        this.resizeWindow();
        this.app.addEvent("resize", function(){
            this.resizeWindow();
        }.bind(this));




    },
    reload:function(){
        this.createCustomerContent();
        this.resizeWindow();
    },

    createHeadContent:function(){
        if(this.headContentDiv) this.headContentDiv.destroy();
        this.headContentDiv = new Element("div.headContentDiv",{"styles":this.css.headContentDiv}).inject(this.rightContentDiv);
        this.headTitleDiv = new Element("div.headTitleDiv",{
            "styles":this.css.headTitleDiv,
            "text":this.lp.head.headTitle
        }).inject(this.headContentDiv);
        //search
        this.headSearchDiv = new Element("div.headSearchDiv",{"styles":this.css.headSearchDiv}).inject(this.headContentDiv);
        this.headSearchTextDiv = new Element("div.headSearchTextDiv",{"styles":this.css.headSearchTextDiv}).inject(this.headSearchDiv);
        this.headSearchImg = new Element("img.headSearchImg",{
            "styles":this.css.headSearchImg,
            "src": this.path+"default/icons/search.png"
        }).inject(this.headSearchTextDiv);
        this.headSearchInput = new Element("input.headSearchInput",{
            "styles":this.css.headSearchInput,
            "placeholder":this.lp.head.searchText
        }).inject(this.headSearchTextDiv);
        this.headSearchInput.addEvents({
            "keyup":function(){
                if(this.headSearchInput.get("value")!=""){
                    this.headSearchRemoveImg.setStyles({"display":"inline-block"})
                }
            }.bind(this)
        });
        this.headSearchRemoveImg = new Element("img.headSearchRemoveImg",{
            "styles":this.css.headSearchRemoveImg,
            "src": this.path+"default/icons/remove.png"
        }).inject(this.headSearchTextDiv);
        this.headSearchRemoveImg.addEvents({
            "click":function(){
                this.headSearchInput.set("value","")
            }.bind(this)
        });
        this.headSearchBottonDiv = new Element("div.headSearchBottonDiv",{
            "styles":this.css.headSearchBottonDiv,
            "text":this.lp.head.search
        }).inject(this.headSearchDiv);
        this.headBottonDiv = new Element("div.headBottonDiv",{"styles":this.css.headBottonDiv}).inject(this.headContentDiv);
        this.headNewBottonDiv = new Element("div.headNewBottonDiv",{
            "styles":this.css.headNewBottonDiv,
            "text" :this.lp.head.create
        }).inject(this.headBottonDiv);
        this.headNewBottonDiv.addEvents({
            "click":function(){
                MWF.xDesktop.requireApp("CRM", "CustomerEdit", function(){
                    this.explorer = new MWF.xApplication.CRM.CustomerEdit(this, this.actions,{},{
                        "isEdited":true,
                        "isNew":true,
                        "onReloadView" : function(  ){
                            //alert(JSON.stringify(data))
                            this.reload();
                        }.bind(this)
                    });
                    this.explorer.load();
                }.bind(this))
            }.bind(this)

        });
        this.headMoreBottonDiv = new Element("div.headMoreBottonDiv",{
            "styles":this.css.headMoreBottonDiv,
            "text" :this.lp.head.moreAction
        }).inject(this.headBottonDiv);
        this.headMoreBottonDiv.addEvents({
            "click":function(){

            }.bind(this)
        });
        this.headMoreImg = new Element("img.headMoreImg",{
            "styles": this.css.headMoreImg,
            "src" : this.path+"default/icons/arrow.png"
        }).inject(this.headMoreBottonDiv);

    },
    createToolBarContent:function(){

    },
    createCustomerContent:function(){
        if(this.contentListDiv) this.contentListDiv.destroy();
        this.contentListDiv = new Element("div.contentListDiv",{"styles":this.css.contentListDiv}).inject(this.rightContentDiv);
        if(this.contentListInDiv) this.contentListInDiv.destroy();
        this.contentListInDiv = new Element("div.contentListInDiv",{"styles":this.css.contentListInDiv}).inject(this.contentListDiv);

        this.bottomPageBar = new Element("div.bottomPageBar",{"styles":this.css.bottomPageBar}).inject(this.contentListDiv);

        this.loadView();

        this.view.node.addEvents({
            "scroll":function(e){
                this.view.nodeHead.setStyle("margin-left",(0-this.view.node.scrollLeft)+"px");
            }.bind(this)
        });
    },

    loadView : function(){

        this.view = new MWF.xApplication.CRM.Customer.View( this.contentListInDiv, this.app, this, {
            templateUrl : this.path+"customerView.json",
            pagingEnable : true,
            pagingPar : {
                position : ["bottom"],
                hasNextPage : false,
                hasReturn:false,
                currentPage : this.options.viewPageNum||1,
                countPerPage : 30,
                onPostLoad : function( pagingBar ){

                }.bind(this),
                onPageReturn : function( pagingBar ){

                }.bind(this)
            }
        },{lp:this.app.lp.customerView,css : this.css} );
        //this.view.filterData = { sectionId : "5a60743f-e074-43ad-86c1-87c88b125281" , withTopSubject : true };
        //this.view.pagingContainerTop = this.pagingBarTop;
        this.view.pagingContainerBottom = this.bottomPageBar;
        this.view.load();
    },

    resizeWindow:function(){
        var size = this.rightContentDiv.getSize();
        var rSize = this.headTitleDiv.getSize();
        var lSize = this.headBottonDiv.getSize();
        if(this.headSearchDiv){
            var x = this.headSearchDiv.getSize().x;
            this.headSearchDiv.setStyles({"margin-left":(size.x-rSize.x-lSize.x)/2-(x/2)+"px"});
        }

        if(this.contentListDiv)this.contentListDiv.setStyles({"height":(size.y-this.headContentDiv.getHeight()-2)+"px","width":(this.rightContentDiv.getWidth())+"px"});
        if(this.contentListInDiv)this.contentListInDiv.setStyles({"height":(this.contentListDiv.getHeight()-this.bottomPageBar.getHeight())+"px","width":(this.rightContentDiv.getWidth())+"px"});
        if(this.view && this.view.node){
            //alert(this.contentListInDiv.getHeight())
            this.view.node.setStyles({
                "height":(this.contentListInDiv.getHeight()-40)+"px",
                "width":this.rightContentDiv.getWidth()+"px"
            });
        }
    }

});


MWF.xApplication.CRM.Customer.View = new Class({
    Extends: MWF.xApplication.Template.Explorer.ComplexView,
    load: function () {
        this.thWidthArr = [];
        this.initData();
        this.ayalyseTemplate();

        var nodeHead =  this.nodeHead = new Element("div.viewHeadListNode",{
            "styles":this.css.viewHeadListNode
        }).inject(this.container);

        this.node = new Element("div.viewBodyNode", {
            "styles": this.css.viewBodyNode
        }).inject(this.container);

        if( this.options.scrollEnable ){
            this.setScroll();
        }
        this.getContentTemplateNode();
        this.createHeadNode();
        this.createViewNode();
        //this.initSortData();
        //this.createViewHead();
        this.createViewBody();
    },
    createHeadNode:function(){
        var _width = 0;
        this._width = 0;
        this.template.items.each(function (item,i) {
            var headItemNode = this.formatElement(this.nodeHead, item.head);
            if(item.head.width){
                headItemNode.setStyle("width",parseInt(item.head.width)+"px");
                _width = _width + parseInt(item.head.width);
                if(i==this.template.items.length-1){
                    if(_width<this.explorer.contentListInDiv.getWidth()){
                        this.lastTdWidth = this.explorer.contentListInDiv.getWidth()-_width+parseInt(item.head.width);
                        headItemNode.setStyle("width",parseInt(this.explorer.contentListInDiv.getWidth()-_width+parseInt(item.head.width))+"px");
                        headItemNode.set("width",this.lastTdWidth);
                        this._width = this._width + this.lastTdWidth;
                    }else{
                        this.lastTdWidth = parseInt(item.head.width);
                        this._width = this._width + parseInt(item.head.width);
                    }
                }else{
                    this._width = this._width + parseInt(item.head.width);
                }

            }

        }.bind(this));


    },
    _createDocument: function(data, index){
        return new MWF.xApplication.CRM.Customer.Document(this.viewNode, data, this.explorer, this, null,  index);
    },
    _getCurrentPageData: function(callback, count, pageNum){
        this.clearBody();
        if(!count)count=30;
        if(!pageNum)pageNum = 1;

        var filter = this.filterData || {};
        //var filter = {};
        //this.app.createShade();
        this.explorer.actions.getCustomerListPage( pageNum, count, filter, function(json){
            if( !json.data )json.data = [];
            if( !json.count )json.count=0;
            this.app.destroyShade();
            if( callback )callback(json);
        }.bind(this))
    },
    _removeDocument: function(documentData, all){

    },
    _create: function(){

    },
    _openDocument: function( documentData,index ){

        documentData = {
            id:"5514a10e-0789-4289-a4b5-c54022075553"
        };
        MWF.xDesktop.requireApp("CRM", "CustomerRead", function(){
            this.customerRead = new MWF.xApplication.CRM.CustomerRead(this.explorer.contentListDiv,this.app, this.explorer,this.actions,{
                "width":1000,
                "onReloadView" : function(){
                    //alert("reload list")
                    //alert(this.currentPage)
                    this.gotoPage(this.currentPage)
                    //this.explorer.createCustomerContent();
                }.bind(this)
            } );
            this.customerRead.load(documentData);
            this.explorer.formContentArr.push(this.customerRead);
            this.explorer.formMarkArr.push(this.customerRead.formMaskNode);

        }.bind(this));
    },
    _queryCreateViewNode: function(){
    },
    _postCreateViewNode: function( viewNode ){
        this.viewNode.set("width",this._width+"px");
    },
    _queryCreateViewHead:function(){
    },
    _postCreateViewHead: function( headNode ){

    }

});


MWF.xApplication.CRM.Customer.Document = new Class({
    Extends: MWF.xApplication.Template.Explorer.ComplexDocument,
    _queryCreateDocumentNode:function( itemData ){
    },
    _postCreateDocumentNode: function( itemNode, itemData ){
        this.view.template.items.each(function (item,i) {
            if(item.head.width){
                itemNode.getElements("td")[i].set("width",item.head.width);
            }
            if(i == itemNode.getElements("td").length-1){
                itemNode.getElements("td")[i].set("width",this.view.lastTdWidth);
            }
        }.bind(this));

    },
    open: function (e) {
        this.view._openDocument(this.data, this.index);
    },
    edit : function(){
        var appId = "ForumDocument"+this.data.id;
        if (this.app.desktop.apps[appId]){
            this.app.desktop.apps[appId].setCurrent();
        }else {
            this.app.desktop.openApplication(null, "ForumDocument", {
                "sectionId" : this.data.sectionId,
                "id" : this.data.id,
                "appId": appId,
                "isEdited" : true,
                "isNew" : false,
                "index" : this.index
            });
        }
    }
})





//
//MWF.xApplication.CRM.Customer.View = new Class({
//    Extends: MWF.xApplication.Template.Explorer.ComplexView,
//
//    _createDocument: function(data){
//        return new MWF.xApplication.CRM.Customer.Document(this.viewNode, data, this.explorer, this);
//    },
//
//    _getCurrentPageData: function(callback, count){
//        var category = this.category = this.options.category;
//
//        if (!count)count = 20;
//        var id = (this.items.length) ? this.items[this.items.length - 1].data.id : "(0)";
//
//        if(id=="(0)")this.app.createShade();
//
//        var filter = this.options.filterData || {};
//
//        this.actions.getCustomerListNext(id, count, filter, function (json) {
//            if (callback)callback(json);
//            this.app.destroyShade();
//        }.bind(this));
//
//    },
//    _create: function(){
//
//    },
//    _openDocument: function( documentData ){
//
//        //if(this.customerRead){
//        //    this.customerRead.load(documentData)
//        //}else{
//            MWF.xDesktop.requireApp("CRM", "CustomerRead", function(){
//                this.customerRead = new MWF.xApplication.CRM.CustomerRead(this.explorer.contentListDiv,this.app, this.explorer,this.actions,{
//                    "width":1000,
//                    "onReloadView" : function(){
//                        this.explorer.reloadCustomerView();
//                    }.bind(this)
//                } );
//                this.customerRead.load(documentData);
//                this.explorer.formContentArr.push(this.customerRead);
//                this.explorer.formMarkArr.push(this.customerRead.formMaskNode);
//
//            }.bind(this));
//        //}
//
//    },
//    _queryCreateViewNode: function(){
//
//    },
//    _postCreateViewNode: function( viewNode ){
//
//    },
//    _queryCreateViewHead:function(){
//
//    },
//    _postCreateViewHead: function( headNode ){
//
//    }
//
//});
//
//MWF.xApplication.CRM.Customer.Document = new Class({
//    Extends: MWF.xApplication.Template.Explorer.ComplexDocument,
//
//    "viewActionReturn":function(){
//        return false
//    }
//
//});