import { gql } from '@apollo/client'
import { profileById } from '../../../context/query';
import { apolloClient } from '../../services/ApolloClient';
import { createBroadcast } from '../Brodcast/brodcast';


const CREATE_MIRROR_TYPED_DATA = `
  mutation($request: CreateMirrorRequest!) { 
    createMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
                referenceModule
        referenceModuleData
        referenceModuleInitData
      }
     }
   }
 }
`
const   CREATE_GASLESS_MIRROR= `
mutation  ($request: CreateMirrorRequest!) {
  createMirrorViaDispatcher(request: $request) {
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


export const createMirrorTypedDataNft = (createMirrorTypedDataRequest) => {
    return apolloClient.mutate({
     mutation: gql(CREATE_MIRROR_TYPED_DATA),
     variables: {
       request: createMirrorTypedDataRequest
     },
   })
 }

 export const  createGeslessMirrorNft = (createGasless) => {
  return apolloClient.mutate({
   mutation: gql(CREATE_GASLESS_MIRROR),
   variables: {
     request: createGasless
   },
 })
}

export const mirrorNft = async (createMirrorRequest ) => {
  const profileId = window.localStorage.getItem("profileId");
  const profileResult = await profileById(profileId);
  if (!profileResult) {
    console.log('Could not find profile');
    return;
  }

  // this means it they have not setup the dispatcher, if its a no you must use broadcast
  if (profileResult?.dispatcher?.canUseRelay) {
    const dispatcherResult = await createGeslessMirrorNft(createMirrorRequest);
    console.log('create mirror via dispatcher: createPostViaDispatcherRequest', dispatcherResult);

    if (dispatcherResult.data?.createMirrorViaDispatcher?.__typename !== 'RelayerResult') {
      console.error('create mirror via dispatcher: failed', dispatcherResult);
      console.error('create mirror via dispatcher: failed');
    }

    return  dispatcherResult ;
  } else {
    const signedResult = await createMirrorTypedDataNft(createMirrorRequest);
    console.log('create mirror via broadcast: signedResult', signedResult);

    const broadcastResult = await createBroadcast({
      id: signedResult.result.id,
      signature: signedResult.signature,
    });

    if (broadcastResult.__typename !== 'RelayerResult') {
      console.log('create mirror via broadcast: failed', broadcastResult);
      console.error('create mirror via broadcast: failed');
    }

    console.log('create mirror via broadcast: broadcastResult', broadcastResult);
    return broadcastResult ;
  }
};