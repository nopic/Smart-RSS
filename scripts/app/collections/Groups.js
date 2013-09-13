define('backbone', 'models/Group'], function(BB, Group) {
	var Groups = BB.Collection.extend({
		model: Group
	})

	return Groups;
});