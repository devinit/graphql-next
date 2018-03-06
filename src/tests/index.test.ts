import 'jest';
import {main,  GRAPHQL_ROUTE,  GRAPHIQL_ROUTE} from '..';
import * as http from 'http';
import { createApolloFetch} from 'apollo-fetch';
import * as prettyFormat from 'pretty-format';
import gql from 'graphql-tag';
import * as path from 'path';
import apiModule from './module';

const uri: string = 'http://localhost:3000';

const getFromServer = (urlPath) =>
    new Promise((resolve, reject) => {
        http.get(`${uri}${path}`, (res) => {
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
        .then((server: http.Server) => server.close())
        .catch((error) => {
            if (error) {
                console.error('error: ', error);
                process.exit(1);
            }
        });
    }, 5000);
    it.skip('should have a working GET graphql', () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            gqlTypesGlobPattern: '**/*.graphql'
        })
        .then((server: http.Server) => {
            setTimeout(() => {
                return getFromServer(GRAPHQL_ROUTE).then((res: any) => {
                    server.close();
                    // GET without query returns 400
                    expect(res.statusCode).toBe(400);
                });
            }, 2000);
        })
        .catch((error) => {
            console.log('error');
            if (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }, 5000);
    it.skip('should return query result', () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            gqlTypesGlobPattern: '**/*.graphql'
        })
        .then(async (server: http.Server) => {
            const apolloFetch = createApolloFetch({ uri });
            const query = gql`
                query APINAME {
                    apiName
                }
            `;
            const resp = await apolloFetch({ query});
            expect(prettyFormat(resp)).toMatchSnapshot();
            server.close();
        })
        .catch((error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
        });
    });
    it('should return graphiql query', () => {
        return main({
            resolverPattern: '**/resolverT.js',
            apiModules: [apiModule],
            port: 5000,
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
