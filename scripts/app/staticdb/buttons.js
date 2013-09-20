define({
	feeds: ['feeds:addSource', 'feeds:addFolder', 'feeds:updateAll'],
	articles:['articles:mark', 'articles:update', 'articles:undelete', 'articles:delete', '!right', 'articles:search'],
	article: ['content:mark', 'content:print', 'content:download', 'content:delete', '!right', 'content:showConfig']
});