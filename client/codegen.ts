import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: '../server/gql-schema/typeDefs.graphql',
    documents: ['src/utils/*.{ts,js}'],
    generates: {
        './src/__generated__/': {
            preset: 'client',
            schema: './src/utils/restSchema.graphql',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql'
            }
        }
    },
    ignoreNoDocuments: true
}

export default config;