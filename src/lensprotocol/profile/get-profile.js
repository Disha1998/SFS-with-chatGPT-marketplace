import { apolloClient } from '../services/ApolloClient';
import { gql } from '@apollo/client'

const GET_PROFILES = `
query($request: ProfileQueryRequest!) {
  profiles(request: $request) {
    items {
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
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`;

const GET_PROFILE_BY_ID = `
query($request: SingleProfileQueryRequest!) {
  profile(request: $request) {
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

const getProfileRequest = (request) => {
  return apolloClient.query({
    query: gql(GET_PROFILES),
    variables: {
      request,
    },
  });
};

const getProfileByIdReq = (request) => {
  return apolloClient.query({
    query: gql(GET_PROFILE_BY_ID),
    variables: {
      request,
    },
  });
}; 

export const profile = async (profileHandle) => {
  const request = { handle: profileHandle };
  const profile = await getProfileRequest(request);
  return profile;
};

export const profileByAddress = async (address) => {
  const request = { ownedBy: [address] };
  const profile = await getProfileRequest(request);
  const pId = profile.data.profiles.items[0];
  return pId;
};

export const getProfileById = async (id) => {
  const request = { profileId: id };
  const res = await getProfileByIdReq(request); 
  return res?.data?.profile;
}
 