
import { gql } from '@apollo/client'
import { apolloClient } from '../services/ApolloClient'

const EXPLORE_PROFILES = `
  query($request: ExploreProfilesRequest!) {
    exploreProfiles(request: $request) {
      items {
        id
        name
        bio
        isDefault
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            contractAddress
            amount {
              asset {
                name
                symbol
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
          type
          }
          ... on RevertFollowModuleSettings {
          type
          }
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;


export const exploreProfiles = (exploreProfilesQueryRequest) => {
  return apolloClient.query({
    query: gql(EXPLORE_PROFILES),
    variables: {
      request: exploreProfilesQueryRequest
    },
  })
}

export const exploreProfile = async (data) => {
  const result = await exploreProfiles({
    "sortCriteria": 'MOST_FOLLOWERS',
    "limit": 8,
    "cursor": data,
  });
  return result.data;
};

export const exploreProfileOnSlider = async (data) => {
  const result = await exploreProfiles({
    "sortCriteria": 'MOST_FOLLOWERS',
    "limit": 50,
    "cursor": data,
  });
  return result.data;
};


const RECOMMENDED_PROFILE = `
query RecommendedProfiles {
  recommendedProfiles {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
        followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
  }
}
`


export const recommendedProfile = (recommended) => {
  return apolloClient.query({
    query: gql(RECOMMENDED_PROFILE),
    variables: {
      request: recommended
    },
  })
}

export const recommendedPro = async (data) => {
  const result = await recommendedProfile({ 
    "limit": 50,
    "cursor": data,
  }); 
  return result.data;
};


