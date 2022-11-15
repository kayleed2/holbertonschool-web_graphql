const Project = require('../models/project');
const Task = require('../models/task');
const _ = require('lodash');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    Task: {
      type: TaskType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (parent, args) => Task.findById(args.id)
    },
    Project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (parent, args) => Project.findById(args.id)
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: () => Task.find({})
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: () => Project.find({})
    }
  })
})

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    title: {
      type: GraphQLString
    },
    weight: {
      type: GraphQLInt
    },
    description: {
      type: GraphQLString
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: (parent, args) => Task.find({ projectId: parent.id })
    }
  })
})

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    projectId: {
      type: TaskType,
      resovle: (parent, args) => Project.findById(parent.projectId)
    },
    title: {
      type: GraphQLString
    },
    weight: {
      type: GraphQLInt
    },
    description: {
      type: GraphQLString
    }
  })
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        let project = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description
        });
        try {
          return await project.save();
        } catch (err) {
          console.log(err);
        }
      }
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        let task = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description
        });
        try {
          return await task.save();
        } catch (err) {
          console.log(err);
        }
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
