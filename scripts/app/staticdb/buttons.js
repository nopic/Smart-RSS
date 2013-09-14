define({
	feeds: ['feeds:addSource', 'feeds:addFolder', 'feeds:updateAll'],
	articles:['articles:mark', 'articles:update', 'articles:undelete', 'articles:delete', '!right', 'articles:search'],
	article: ['article:mark', 'article:print', 'article:download', 'article:delete', '!right', 'article:showConfig']
});