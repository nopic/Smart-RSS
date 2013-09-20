define(['chai', 'preps/extendNative'], function(chai) {
	var expect = chai.expect;

	describe('Counters', function() {
		var source;
		var allUnread = bg.info.get('allCountUnread');
		var allTotal = bg.info.get('allCountTotal');
		
		this.timeout(5000);

		describe('Adding feed', function() {
		
			before(function(done) {
				source = bg.sources.create({
					url: 'http://smartrss.martinkadlec.eu/test1.rss'
				});

				source.on('update', function() {
					done();
				});
			});

			it('should increase feed unread counter', function() {
				expect(source.get('count')).to.equal(3);
			});

			it('should increase feed total counter', function() {
				expect(source.get('countAll')).to.equal(3);
			});

			it('should increase all feeds unread counter', function() {
				expect(bg.info.get('allCountUnread')).to.equal(3);
			});

			it('should increase all feeds total counter', function() {
				expect(bg.info.get('allCountTotal')).to.equal(3);
			});

			

			
		});

		describe('Updating feed', function() {
			before(function(done) {
				source.save({ url: 'http://smartrss.martinkadlec.eu/test2.rss' });
				bg.downloadOne(source);

				source.on('update', function() {
					done();
				});
			});

			it('should increase feed counter', function() {
				expect(source.get('count')).to.equal(4);
			});

			it('should increase feed total counter', function() {
				expect(source.get('countAll')).to.equal(4);
			});

			it('should increase all feeds unread counter', function() {
				expect(bg.info.get('allCountUnread')).to.equal(4);
			});

			it('should increase all feeds total counter', function() {
				expect(bg.info.get('allCountTotal')).to.equal(4);
			});
		});

		describe('Destroying feed', function() {

			before(function() {
				source.destroy();
			});

			it('should decrease all feeds unread counter', function() {
				expect(bg.info.get('allCountUnread')).to.equal(allUnread);
			});

			it('should decrease all feeds total counter', function() {
				expect(bg.info.get('allCountUnread')).to.equal(allTotal);
			});
		});
	});
});