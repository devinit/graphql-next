import 'jest';
import {main, GRAPHIQL_ROUTE, GRAPHQL_ROUTE} from '..';
import * as http from 'http';
import { createApolloFetch} from 'apollo-fetch';
import * as prettyFormat from 'pretty-format';
import gql from 'graphql-tag';
import apiModule from './module';

const uri: string = 'http://localhost:3000';

const getFromServer = (urlPath) =>
    new Promise((resolve, reject) => {
        http.get(`${uri}${urlPath}`, (res) => {
            resolve(res);
        })
        .on('error', (err: Error) => reject(err));
    });

describe('main', () => {
    it.skip('should be able to initialise server', () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            gqlTypesGlobPattern: '**/*.graphql'
        })
        .then((server: any) => server.close())
        .catch((error) => {
            if (error) {
                console.error('error: ', error);
                process.exit(1);
            }
        });
    }, 5000);
    it.skip('should have a working GET root path', () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            gqlTypesGlobPattern: '**/*.graphql'
        })
        .then((server: any) => {
            setTimeout(() => {
                return getFromServer('/').then((res: any) => {
                    server.close();
                    // GET without query returns 400
                    expect(res.statusCode).toBe(200);
                });
            }, 2000);
        })
        .catch((error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }, 5000);
    it.skip('should return query results for a graphql query', async () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            gqlTypesGlobPattern: '**/*.graphql'
        })
        .then(async (server: http.Server) => {
            setTimeout(async () => {
                  try {
                const apolloFetch = createApolloFetch({ uri: `${uri}${GRAPHQL_ROUTE}` });
                const query = gql`
                    query APINAME {
                        apiName
                    }
                `;
                const resp = await apolloFetch({ query });
                expect(prettyFormat(resp)).toMatchSnapshot();
                } catch (error) {
                    if (error) console.error(error);
                    process.exit(1);
                }
            }, 5000);
            server.close();
        })
        .catch((error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
        });
    });
    it('should have graphql route', () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            gqlTypesGlobPattern: '**/*.graphql'
        })
        .then((server: http.Server) => {
          return getFromServer(GRAPHQL_ROUTE).then((res: any) => {
            server.close();
            expect(res.statusCode).toBe(500);
          });
        })
        .catch((error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }, 5000);
    it.skip('should return graphiql query', () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            gqlTypesGlobPattern: '**/*.graphql'
        })
        .then((server: http.Server) => {
          return getFromServer(GRAPHIQL_ROUTE).then((res: any) => {
            server.close();
            expect(res.statusCode).toBe(200);
          });
        })
        .catch((error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }, 5000);
});
