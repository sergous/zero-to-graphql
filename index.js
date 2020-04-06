import express from "express";
import graphqlHTTP from "express-graphql";
import DataLoader from "dataloader";

import schema, { getPersonByUrl } from "./schema";

const app = express();

app.use(
    graphqlHTTP((req) => {
        const personLoader = new DataLoader((keys) =>
            Promise.all(keys.map(getPersonByUrl))
        );

        const loaders = {
            person: personLoader,
        };

        return {
            context: { loaders },
            schema,
            graphiql: true,
        };
    })
);

app.listen(3000);
