import { apolloClient } from '../../services/ApolloClient';
import { gql } from '@apollo/client';

import { createBroadcast } from '../Brodcast/brodcast';
import { profileById } from '../../../context/query';
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

export const createCommentTypedDataNft = (createCommentTypedDataRequest) => {
    console.log('createCommentTypedDataRequest', createCommentTypedDataRequest);
    return apolloClient.mutate({
        mutation: gql(CREATE_COMMENT_TYPED_DATA),
        variables: {
            request: createCommentTypedDataRequest
        }
    })
}
export const signCreateCommentTypedDataNft = async (CreatePublicCommentRequest) => {
    const result = await createCommentTypedDataNft(CreatePublicCommentRequest);
     console.log('create comment: createCommentTypedData-----------', result);
    const typedData = result.data.createCommentTypedData.typedData;
    console.log('create comment: typedData', typedData);
    return result ;
};

export const createGasLessCommentNft = (createGasless) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_GASLESS_COMMENT),
    variables: {
      request: createGasless
    },
  })
}

export const commentNft = async (createCommentRequest) => {
  const profileId = window.localStorage.getItem("profileId");
  const profileResult = await profileById(profileId);
  if (!profileResult) {
    console.log('Could not find profile');
    return;
  }


  // this means it they have not setup the dispatcher, if its a no you must use broadcast
  if (profileResult.dispatcher?.canUseRelay) {
    const dispatcherResult = await createGasLessCommentNft(createCommentRequest); 

    if (dispatcherResult?.data?.createCommentViaDispatcher?.__typename !== 'RelayerResult') { 
      console.log('create comment via dispatcher: failed');
    }

    return dispatcherResult;
  } else {
    const signedResult = await createCommentTypedDataNft(createCommentRequest);
    console.log('create comment via broadcast: signedResult', signedResult);

    const broadcastResult = await createBroadcast({
      id: signedResult.result.id,
      signature: signedResult.signature,
    });

    if (broadcastResult.__typename !== 'RelayerResult') {
      console.error('create comment via broadcast: failed', broadcastResult);
      console.log('create comment via broadcast: failed');
      return;
    }

    console.log('create comment via broadcast: broadcastResult', broadcastResult);
    return broadcastResult;
  }
};