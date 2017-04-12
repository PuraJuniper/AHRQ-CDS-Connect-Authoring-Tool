import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const baseurl = 'http://localhost:3001/api/';
const mock = new MockAdapter(axios);
jest.unmock('../components/AuthorBox');

const authorsFixture = [{
  name: "NewKid 2",
  text: "Breakout hit"
},{
  name: "BigWig Authoress",
  text: "A Thousand Reasons to Swoon"
}];

mock.onGet(baseurl + 'authors')
  .reply(200, { response: { data: authorsFixture } });

mock.onPut(baseUrl + 'authors/1').reply(200, { response: {} });
mock.onDelete(baseUrl + 'authors/1').reply(200, { response: {} });
mock.onPost(baseUrl + 'authors').reply(200, { response: {} });
