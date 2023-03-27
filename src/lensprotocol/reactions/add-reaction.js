
import { gql } from '@apollo/client'
import { toast } from 'react-toastify';
import { apolloClient } from '../services/ApolloClient';
import { getAddress } from '../services/ethers-service';

const ADD_REACTION = `
  mutation($request: ReactionRequest!) { 
   addReaction(request: $request)
 }
`;

const REMOVE_REACTION = `
  mutation($request: ReactionRequest!) { 
   removeReaction(request: $request)
 }
`;

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

const getReactionReq = (request) => {
    return apolloClient.mutate({
        mutation: gql(GET_REACTION),
        variables: {
            request: request,
        },
    });
};

const addReactionRequest = (request) => { 
    return apolloClient.mutate({
        mutation: gql(ADD_REACTION),
        variables: {
            request: request,
        },
    });
};

export const addReaction = async (data) => { 
    try {
        const profileId = data.id;
        if (!profileId) {
            toast.error('Please login first!');
            return;
        }
        // const address = getAddress(); 

        await data.login(data.address);

        const request = { profileId: profileId, reaction: "UPVOTE", publicationId: data.publishId };
       
        const rr = await addReactionRequest(request); 
    } catch (error) {
        toast.error(error);
    }
}



const removeReactionRequest = (
    profileId,
    reaction,
    publicationId
) => {
    return apolloClient.mutate({
        mutation: gql(REMOVE_REACTION),
        variables: {
            request: {
                profileId,
                reaction,
                publicationId,
            },
        },
    });
};

export const removeReaction = async (data) => {
    const profileId = data.id;
    if (!profileId) {
        toast.err('Please Login first!');
    } 
    const address = getAddress(); 
    await data.login(data.address); 
    const dd = await removeReactionRequest(profileId, 'UPVOTE', data.publishId);
    
};

export const getReactions = async (data) => { 
    const request = { publicationId:  data }
    const res = await getReactionReq(request); 
    return res.data.whoReactedPublication;
};
