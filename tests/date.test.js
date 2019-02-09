import DateService from '../js/providers/date.js';

describe('Date Service test', () => {
	const dateService = new DateService();//initiatlise date service
	const today = new Date();//get today

	describe('Check formatted date with no argument', () => {
		it('Check if format date returns right now', () => {
			let nowMillisecs = Date.now();
			let nowFormatted = dateService.formatDate(nowMillisecs);
			expect(nowFormatted).toMatch('right now');
		});

		it('Check if format date returns sec. ago', () => {
			let secsAgo = new Date(Date.now() - 20000);//some seconds ago
			let secsAgoFormatted = dateService.formatDate(secsAgo);
			expect(secsAgoFormatted).toMatch('sec. ago');
		});

		it('Check if format date returns min. ago', () => {
			let minAgo = new Date(Date.now() - 200000);//some minutes ago
			let minAgoFormatted = dateService.formatDate(minAgo);
			expect(minAgoFormatted).toMatch('min. ago');
		});

		it('Check if format date returns min. ago', () => {
			let someDate = new Date('1/1/2019');// 1/1/2019
			let someDateMillisec = someDate.getTime();
			let someDateFormatted = dateService.formatDate(someDateMillisec);
			expect(someDateFormatted).toContain('01.01.19');
		});
	});

	describe('Check formatted date with day argument', () => {
		it('Check if format date returns Today', () => {
			let todayMillisecs = Date.now();
			let todayFormatted = dateService.formatDate(todayMillisecs, 'day');
			expect(todayFormatted).toMatch('Today');
		});

		it('Check if format date returns Yesterday', () => {
			// let today = new Date();//get today
			let yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);//get yesterday date
			let yesterdayAgoFormatted = dateService.formatDate(yesterday, 'day');
			expect(yesterdayAgoFormatted).toMatch('Yesterday');
		});
	});
});