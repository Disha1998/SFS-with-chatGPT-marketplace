
import { gql } from '@apollo/client'
import { apolloClient } from '../services/ApolloClient'
import { getAddress, getAddressFromSigner } from '../services/ethers-service';

const CREATE_FOLLOW_TYPED_DATA = `
  mutation($request: FollowRequest!) { 
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData { 
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
 }
`;


const CREATE_UNFOLLOW_TYPE_DATA = `
mutation ($request: UnfollowRequest!) {
  createUnfollowTypedData(request: $request) {
    id
    expiresAt
    typedData {
      types {
        BurnWithSig {
          name
          type
        }
      }
      domain {
        version
        chainId
        name
        verifyingContract
      }
      value {
        nonce
        deadline
        tokenId
      }
    }
  }
} 
`

export const createUnfollowTypdeData = (id) => {  
  return apolloClient.mutate({
    mutation: gql(CREATE_UNFOLLOW_TYPE_DATA),
    variables: {
      request: {
        profile: id,
      },
    },
  });
}


export const createFollowTypedData = (followRequestInfo) => { 
  return apolloClient.mutate({
    mutation: gql(CREATE_FOLLOW_TYPED_DATA),
    variables: {
      request: {
        follow: followRequestInfo,
      },
    },
  });
}

const FREE_FOLLOW = `
mutation ($request: ProxyActionRequest! ){
  proxyAction(request: $request){
    proxyAction
  }
}
`

const PROXY_STATUS = `
query ($request: ProxyActionId!) {
  proxyActionStatus(proxyActionId: $request) {
    ... on ProxyActionStatusResult {
      txHash
      txId
      status
    }
    ... on ProxyActionError {
      reason
      lastKnownTxId
    }
    ... on ProxyActionQueued {
      queuedAt
    }
  }
}
`

export const proxyActionStatusRequest = async (proxyActionId) => {
  const result = await apolloClient.query({
    query: gql(PROXY_STATUS),
    variables: {
      proxyActionId,
    },
  });

  // return apolloClient.mutate({
  //   mutation: gql(PROXY_STATUS),
  //   variables: {
  //     proxyActionId,
  //   },
  // })

  return result.data.proxyActionStatus;
};

export const freeFollow = (id) => {
  return apolloClient.mutate({
    mutation: gql(FREE_FOLLOW),
    variables: {
      request: {
        follow: {
          freeFollow: {
            profileId: id
          }
        }
      }
    },
  });
}

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};


export const proxyActionFreeFollow = async (data) => {
  const address = await getAddress();
  console.log('proxy action free follow: address', address);

  await data.login(address);
  const result = await freeFollow(data.followId);
  console.log('proxy action free follow: result', result);

  while (true) {
    const statusResult = await proxyActionStatusRequest(result);
    console.log('proxy action free follow: status', statusResult);
    if (statusResult.__typename === 'ProxyActionStatusResult') {
      if (statusResult.status === '') {
        console.log('proxy action free follow: complete', statusResult);
        break;
      }
    }
    if (statusResult.__typename === 'ProxyActionError') {
      console.log('proxy action free follow: failed', statusResult);
      break;
    }
    await sleep(1000);
  }

  return result;
};
