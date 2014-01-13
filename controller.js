//controller
//



(function( app, $, undefined ) {
    app.controller = app.controller || {};

	//public
	app.controller.render = function(){
        var screenId = app.model.getScreenId();
        console.log(screenId);
        var data = {};
        switch(screenId){
            case 'selectLanguage':
                app.view.renderSelectLanguage();
                break;
            case 'selectGroup':
                app.view.renderSelectGroup();
                break;
            case 'route':
                data.group = app.model.getGroup();
                data.items = app.model.getMainItems();
                data.voteMode1 = app.model.isVoteMode1();
                data.voteMode1RoundType = (data.voteMode1 ? app.model.getVoteMode1RoundType() : undefined);
                data.voteMode2 = app.model.isVoteMode2();                
                data.viewMode = app.model.isViewMode();
                data.voteMode1Ready = app.model.isVoteMode1Ready();
                data.seenMainItems = app.model.seenMainItems();
                app.view.renderRoute(data);
                break;
            case 'vote_round_two':
                data.group = app.model.getGroup();
                data.items = app.model.getMainItems();
                app.view.renderVoteRound2(data);
                break;
            case 'final':
                data.group = app.model.getGroup();
                data.items = app.model.getMainItems();
                app.view.renderFinal(data);            
                break;
            case 'extra':
                data.group = app.model.getGroup();
                data.items = [];
                data.items.push(app.model.getExtraItem(0));
                data.items.push(app.model.getExtraItem(1));
                data.items.push(app.model.getExtraItem(2));
                app.view.renderExtra(data);
                break;
            case 'lightbox':
                var num = app.model.getScreenDetailNum();
                data.item = app.model.getItem(num);
                data.item.id=num;
                data.group = app.model.getGroup();                
                app.view.renderImageInLightbox(data.item);
                break;
            case 'detail':
                //TODO
                var num = app.model.getScreenDetailNum();
                data.item = app.model.getItem(num);
                data.item.id=num;
                data.group = app.model.getGroup();

                app.view.renderDetail(data);
                break;
        }
    };


	function privateFunction(){

	}
}( (window.app = window.app || {}), jQuery ));
