const { readFileSync } = require('fs');
const path = require('path');

const typeDefs = readFileSync(path.join(__dirname, 'typeDefs.graphql'), { encoding: 'utf-8' });
const resolvers = require('./resolvers');

module.exports = { typeDefs, resolvers };