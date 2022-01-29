const GraphQLString = require("gatsby/graphql").GraphQLString
const GraphQLList = require("gatsby/graphql").GraphQLList
const GraphQLObjectType = require("gatsby/graphql").GraphQLObjectType

const vocabularyWordRegex = /<\s*vocabulary-word\s+name\s*=\s*['"]\s*([^"]*)\s*['"]\s*>/gm
const withDescriptionRegex = /<\s*vocabulary-word\s+name\s*=\s*['"]\s*(.*)\s*['"]\s+description\s*=\s*['"]\s*(.*)\s*['"]\s*>/gm
const withDescriptionRegex2 = /<\s*vocabulary-word\s+description\s*=\s*['"]\s*(.*)\s*['"]\s+name\s*=\s*['"]\s*(.*)\s*['"]\s*>/gm

function getMatches(string, regex, index) {
  index || (index = 1) // default to the first capturing group
  var matches = []
  var match
  while ((match = regex.exec(string))) {
    const location = match.index
    matches.push({
      match: match[index],
      description: match[index + 1],
      location,
    })
  }
  return matches
}

const VocabularyWordType = new GraphQLObjectType({
  name: `VocabularyWord`,
  fields: {
    name: {
      type: GraphQLString,
      resolve(details) {
        return details.name
      },
    },
    description: {
      type: GraphQLString,
      resolve(details) {
        return details.description
      },
    },
    type: {
      type: GraphQLString,
      resolve(details) {
        return details.type
      },
    },
    parentPagePath: {
      type: GraphQLString,
      resolve(details) {
        return details.parentPagePath
      },
    },
  },
})

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name === `MarkdownRemark`) {
    return {
      vocabularyWords: {
        type: GraphQLList(VocabularyWordType),
        resolve: (node, _fieldArgs) => {
          const source = node.rawMarkdownBody || ""
          const words = getMatches(source, vocabularyWordRegex, 1).map(res => {
            return {
              name: res.match,
              location: res.location,
              type: "vocabularyWord",
              parentPagePath: node.frontmatter.path,
            }
          })

          const wordsWithDesc = getMatches(source, withDescriptionRegex, 1).map(
            res => {
              return {
                name: res.match,
                description: res.description,
                location: res.location,
                type: "vocabularyWord",
                parentPagePath: node.frontmatter.path,
              }
            },
          )

          const wordsWithDesc2 = getMatches(
            source,
            withDescriptionRegex2,
            1,
          ).map(res => {
            return {
              name: res.description,
              description: res.match,
              location: res.location,
              type: "vocabularyWord",
              parentPagePath: node.frontmatter.path,
            }
          })

          return words.concat(wordsWithDesc).concat(wordsWithDesc2)
        },
      },
    }
  }

  // by default return empty object
  return {}
}
