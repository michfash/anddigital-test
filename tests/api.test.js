import Api from '../js/providers/api.js';
jest.mock('../js/providers/api.js');

describe('Api Service test', () => {
	beforeEach(() => {
	  // Clear all instances and calls to constructor and all methods:
		Api.mockClear();
		const mockApiConnection = jest.fn();
		const sendApiRequest = jest.fn( () => {
			return [19122079,19121828,19122136,19113147,19121947,19115964,19120646,19122211,19121882];
		});

		Api.mockImplementation( () => {
			return {
				establishConnection: mockApiConnection,
				sendRequest: sendApiRequest
			};
		});
	});

	it('Check if connection to endpoint is established when Api is instantiated', () => {
		const apiServiceStories = new Api('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json');
		expect(Api).toHaveBeenCalled();
	});

	it('Send an Api request and expect method to have been called', () => {
		const apiServiceStories = new Api('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json');
		const spySendRequest = jest.spyOn(apiServiceStories, 'sendRequest');//spy on sendRequest method
		apiServiceStories.sendRequest();//send the api request

		const topStoriesIds = apiServiceStories.sendRequest.mock.results[0].value;//sendRequest mock result values

		expect(Api).toHaveBeenCalledTimes(1);//expexct Api call to have been made once
		expect(spySendRequest).toHaveBeenCalled();
		expect(topStoriesIds).toBeDefined();//expect mock result values
	});
});