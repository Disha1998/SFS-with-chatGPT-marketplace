
import { gql } from '@apollo/client'
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed';
import { apolloClient } from '../services/ApolloClient'
import { getAddress, signedTypeData, splitSignature } from '../services/ethers-service';
import { lensHub } from '../services/lens-hub';

const DISABLE_DISPATCHER = `
mutation($request: SetDispatcherRequest!) {  
    createSetDispatcherTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDispatcherWithSig {
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
          dispatcher
        }
      }
    }
  }
`;
export const disableDispatcher = (request) => { 
    return apolloClient.mutate({
        mutation: gql(DISABLE_DISPATCHER),
        variables: {
            request,
        },
    });
}

export const enableDispatcher = (profileId) => {
    return apolloClient.mutate({
        mutation: gql(DISABLE_DISPATCHER),
        variables: {
            request: {
                profileId,
            },
        },
    });
}

export const enableDispatFun = async (id) => { 
    const result = await enableDispatcher(id); 
    const typedData = result.data?.createSetDispatcherTypedData?.typedData;
    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.setDispatcherWithSig({
        profileId: typedData.value.profileId,
        dispatcher: typedData.value.dispatcher,
        sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
        },
    });
    const done = await tx.wait(); 
}

export const disableDispatFun = async (profileId) => {
    const req = {
        profileId,
        enable: false,
    }
    const result = await disableDispatcher(req); 
    const typedData = result.data?.createSetDispatcherTypedData?.typedData;
    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.setDispatcherWithSig({
        profileId: typedData.value.profileId,
        dispatcher: typedData.value.dispatcher,
        sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
        },
    });

    const indexedResult = await pollUntilIndexed(tx.hash);
    const logs = indexedResult.txReceipt.logs;
    return logs;
}