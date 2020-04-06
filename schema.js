import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import fetch from "node-fetch";

const BASE_URL = `http://localhost:8000`;

export const getPersonByUrl = (relativeUrl) => {
    return fetch(`${BASE_URL}${relativeUrl}`)
        .then((res) => res.json())
        .then((json) => json);
};

const PersonType = new GraphQLObjectType({
    name: "Person",
    description: "...",

    fields: () => ({
        firstName: {
            type: GraphQLString,
            resolve: (person) => person.first_name,
        },
        lastName: {
            type: GraphQLString,
            resolve: (person) => person.last_name,
        },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        id: { type: GraphQLString },
        friends: {
            type: new GraphQLList(PersonType),
            resolve: (person, args, { loaders }) =>
                loaders.person.loadMany(person.friends),
        },
    }),
});

const QueryType = new GraphQLObjectType({
    name: "Query",
    description: "...",

    fields: () => ({
        person: {
            type: PersonType,
            args: {
                id: {
                    type: GraphQLString,
                },
            },
            resolve: (root, args, { loaders }) =>
                loaders.person.load(`/people/${args.id}`),
        },
    }),
});

export default new GraphQLSchema({
    query: QueryType,
});
