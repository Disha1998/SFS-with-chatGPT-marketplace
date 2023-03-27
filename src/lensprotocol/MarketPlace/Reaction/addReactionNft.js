import { gql } from "@apollo/client"
import { apolloClient } from "../../services/ApolloClient";
import { getAddressFromSigner } from "../../services/ethers-service";

const ADD_REACTION = `
mutation ($request: ReactionRequest!) {
    addReaction(request: $request)
}
`
const GET_REACTION = `
query($request: WhoReactedPublicationRequest!)  {
    whoReactedPublication(request: $request ) {
      items {
        reactionId
        reaction
        reactionAt
        profile {
          ...ProfileFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  
  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }
  
  
  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    isFollowedByMe
    isFollowing(who: null)
    followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
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
      ...FollowModuleFields
    }
  }
  
  fragment FollowModuleFields on FollowModule {
    ... on FeeFollowModuleSettings {
      type
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
      contractAddress
    }
    ... on RevertFollowModuleSettings {
      type
      contractAddress
    }
    ... on UnknownFollowModuleSettings {
      type
      contractAddress
      followModuleReturnData
    }
  }
`;

const REMOVE_REACTION = ` 
mutation($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`
const addReactionRequest = async (request) => {
  return apolloClient.mutate({
    mutation: gql(ADD_REACTION),
    variables: {
      request: request,
    },
  });
};

export const addReactionNft = async (data) => {
  try {
    let profileId = data.id;
    if (!profileId) {
      console.log('Please login first!');
      return;
    }

    await data.login(data.address);

    const request = {
      profileId: profileId,
      reaction: "UPVOTE",
      publicationId: data.publishId
    };

    const result = await addReactionRequest(request);
    console.log('result', result);

  } catch (error) {
    console.log(error);
  }
}

const getReactionReq = (request) => {
  // console.log(request, "request");
  return apolloClient.mutate({
    mutation: gql(GET_REACTION),
    variables: {
      request: request,
    },
  });
};

export const getReactionsNft = async (id) => {
  const result = await getReactionReq({ publicationId: id });
  // console.log('who collected--get reaction: result', result);
  return result.data.whoReactedPublication;
};

const removeReactionRequest = (request) => {
  // console.log('request==remove', request);
  return apolloClient.mutate({
    mutation: gql(REMOVE_REACTION),
    variables: {
      request: request
    }
  })
}



export const removeReactionNft = async (data) => {
  // console.log('removeReaction==!!!!!!', data);
  const profileId = window.localStorage.getItem("profileId");
  // console.log('profileId', profileId);
  if (!profileId) {
    alert('Must define PROFILE_ID in the .env to run this');
  }

  const address = getAddressFromSigner();
  // console.log('remove reaction: address', address);

  await data.login(address);

  await removeReactionRequest({
    profileId,
    reaction: 'UPVOTE',
    publicationId: data.publishId,
  });

  // alert('remove reaction: sucess');
};