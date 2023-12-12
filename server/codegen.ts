import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: './gql-schema/typeDefs.graphql',
    generates: {
        './gql-schema/__generated__/resolver-types.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                useIndexSignature: true,
                contextType: '../../utils/auth.js#UserContext',
                // scalars: {
                //     ID: {
                //         input: 'string',
                //         output: 'mongoose#Types.ObjectId | string'
                //     }
                // },
                mappers: {
                    User: '../../models/User.js#UserDocument'
                }
            }
        }
    }
}

export default config;