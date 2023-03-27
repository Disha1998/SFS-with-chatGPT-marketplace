
import { gql } from '@apollo/client'
import { toast } from 'react-toastify'
import { getProfileById } from '../../profile/get-profile'
import { apolloClient } from '../../services/ApolloClient'
import { createBroadcast } from '../dispatcher/broadcast'
import { createCommentByDis } from './create-comment'

const CREATE_COMMENT_TYPED_DATA = `
  mutation($request: CreatePublicCommentRequest!) { 
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        profileIdPointed
        pubIdPointed
        referenceModuleData
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
     }
   }
 }
`

export const createCommentTypedData = (createCommentTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_COMMENT_TYPED_DATA),
    variables: {
      request: createCommentTypedDataRequest
    },
  })
}

// CreatePublicCommentRequest

const CREATE_GASLESS_COMMENT = `
mutation  ($request:CreatePublicCommentRequest!){
  createCommentViaDispatcher(request: $request) {
    ... on RelayerResult {
      txHash
      txId
    }
    ... on RelayError {
      reason
    }
  }
} 
`

export const createGasLessComment = (createGasless) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_GASLESS_COMMENT),
    variables: {
      request: createGasless
    },
  })
}

export const comment = async (createCommentRequest) => {
  const profileId = window.localStorage.getItem("profileId");
  const profileResult = await getProfileById(profileId);
  if (!profileResult) {
    toast.error('Could not find profile');
    return;
  }


  // this means it they have not setup the dispatcher, if its a no you must use broadcast
  if (profileResult.dispatcher?.canUseRelay) {
    const dispatcherResult = await createGasLessComment(createCommentRequest); 

    if (dispatcherResult?.data?.createCommentViaDispatcher?.__typename !== 'RelayerResult') { 
      toast.error('create comment via dispatcher: failed');
    }

    return dispatcherResult;
  } else {
    const signedResult = await createCommentTypedData(createCommentRequest);
    console.log('create comment via broadcast: signedResult', signedResult);

    const broadcastResult = await createBroadcast({
      id: signedResult.result.id,
      signature: signedResult.signature,
    });

    if (broadcastResult.__typename !== 'RelayerResult') {
      console.error('create comment via broadcast: failed', broadcastResult);
      toast.error('create comment via broadcast: failed');
      return;
    }

    console.log('create comment via broadcast: broadcastResult', broadcastResult);
    return broadcastResult;
  }
};