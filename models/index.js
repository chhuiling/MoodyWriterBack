// 'models' creation for easy acces to each schema
const models = {
    usersModel: require("./nosql/users"),
    postsModel: require("./nosql/posts")
};

// Exports
module.exports = models