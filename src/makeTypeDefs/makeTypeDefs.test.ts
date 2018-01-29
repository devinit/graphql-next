import 'jest';
import { GraphQLSchema, buildSchema } from 'graphql';
import { generateTsFromGql, getTypeDefs} from './';
import simpleSchema from './test/types';
import { schemaToInterfaces } from '@gql2ts/from-schema';
import * as prettyFormat from 'pretty-format';

describe('gql Types to Typescript types', () => {
    // TODO: should work with union tyoes
    it.skip('should return merged typedefs', async () => {
        const typeDefs = await getTypeDefs('**/*.gql');
        expect(prettyFormat(typeDefs)).toMatchSnapshot();
    });
    it.skip('merged types should be convertable to a GraphQLSchema', async () => {
        const typeDefs = await getTypeDefs('**/*.gql');
        expect(buildSchema(typeDefs)).toBeInstanceOf(GraphQLSchema);
    });
    it('merged types schema', async () => {
        // const namespaceOpts = { ignoreTypeNameDeclaration: true};
        const actual: string = schemaToInterfaces(simpleSchema, {
            ignoredTypes: []
          });
        expect(prettyFormat(actual)).toMatchSnapshot();
    });
    it.skip('End to End test: should create typescript types from graphql files', async () => {
        const tsTypesNameSpace = await generateTsFromGql({globPattern: '**/*.gql'});
        expect(prettyFormat(tsTypesNameSpace)).toMatchSnapshot();
    });
});
