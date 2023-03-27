
import { gql } from '@apollo/client'
import { toast } from 'react-toastify'
import { apolloClient } from '../../services/ApolloClient'
import { getAddress } from '../../services/ethers-service'

const CREATE_COLLECT_TYPED_DATA = `
mutation($request: CreateCollectRequest!) { 
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
        pubId
        data
      }
     }
   }
 }
`

export const createCollectTypedData = (createCollectTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_COLLECT_TYPED_DATA),
    variables: {
      request: createCollectTypedDataRequest
    },
  })
}

const CREATE_GASLESS_COLLECT = `
mutation  ($request: ProxyActionRequest!) {
  proxyAction(request: $request)
}
`


export const createfreeCollect = (request) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_GASLESS_COLLECT),
    variables: {
     request   
    },
  })
}

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const proxyActionFreeCollect = async (postData) => {
  const profileId = window.localStorage.getItem("profileId");
  // hard coded to make the code example clear
  
  if (!profileId) {
    toast.error('Please login first!');
    return;
  }
  try { 
    const address = await getAddress();

    await postData.login(address);

    const req = {
      collect: {
        freeCollect: {
          publicationId: '0x43ad-0x01',
        },
      },
    }


    const result = await createfreeCollect(req);
    console.log('proxy action free collect: result', result);

    while (true) {
      const statusResult = await createCollectTypedData(result);
      console.log('proxy action free collect: status', statusResult);
      if (statusResult.__typename === 'ProxyActionStatusResult') {
        if (statusResult.status === "SUCCESS") {
          console.log('proxy action free collect: complete', statusResult);
          break;
        }
      }
      if (statusResult.__typename === 'ProxyActionError') {
        console.log('proxy action free collect: failed', statusResult);
        break;
      }
      await sleep(1000);
    }

    return result;
  } catch (error) {
    toast.error(error);
  }
};

