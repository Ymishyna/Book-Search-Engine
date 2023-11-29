const express = require('express');
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

const startApolloServer = async () => {
  await server.start()
}


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware
}))

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});
// db.on("error", (err) => {
//   console.error("MongoDB connection error: ", err);
// });

startApolloServer()

// const express = require('express');
// const { ApolloServer } = require("@apollo/server-express");
// const { expressMiddleware } = require("@apollo/server-express");
// const path = require('path');
// const db = require('./config/connection');
// const { typeDefs, resolvers } = require("./schemas");
// const { authMiddleware } = require("./utils/auth");

// const app = express();
// const PORT = process.env.PORT || 3001;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: authMiddleware,
// });

// // Integrate Apollo server with Express application
// server.applyMiddleware({ app, context: authMiddleware });

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

// db.once("open", () => {
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//   });
// });

