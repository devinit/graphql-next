import * as prettyFormat from 'pretty-format';
import {get} from '.';

describe('Test query', () => {
    it('should query api', async () => {
        const query = `
            query Countries {
                countries {
                id
                name
                slug
                has_domestic_data
                countryType
                hasPDF
                }
            }`;
        const data = await get('http://212.111.41.68:9090/graphql', query);
        expect(prettyFormat(data)).toMatchSnapshot();
     }, 10000);
});
