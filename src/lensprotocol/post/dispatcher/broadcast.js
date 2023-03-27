import { gql } from "@apollo/client";
import { toast } from "react-toastify";
import { getProfileById } from "../../profile/get-profile";
import { apolloClient } from "../../services/ApolloClient";
import { getAddress, signedTypeData } from "../../services/ethers-service";
import { createPostTypedData } from "../create-post-type-data";


const BROADCAST = `
mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
        ... on RelayerResult {
            txHash
    txId
        }
        ... on RelayError {
            reason
        }
    }
}
`; 

export const createBroadcast = (createPost) => {
    return apolloClient.mutate({
        mutation: gql(BROADCAST),
        variables: {
            request: createPost,
        },
    });
}


// const broadcast = async () => {
//     const address = getAddress();
//     console.log('follow with broadcast: address', address);
  
//     await login(address);
  
//     const result = await createFollowTypedData({
//       follow: [
//         {
//           profile: '0x01',
//         },
//       ],
//     });
//     console.log('follow with broadcast: result', result);
  
//     const typedData = result.typedData;
//     console.log('follow with broadcast: typedData', typedData);
  
//     const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
//     console.log('follow with broadcast: signature', signature);
  
//     const broadcastResult = await broadcastRequest({
//       id: result.id,
//       signature,
//     });
//     console.log('follow with broadcast: broadcastResult', broadcastResult);
//     if (broadcastResult.__typename !== 'RelayerResult') {
//       console.error('follow with broadcast: failed', broadcastResult);
//       throw new Error('follow with broadcast: failed');
//     }
  
//     console.log('follow with broadcast: poll until indexed');
//     const indexedResult = await pollUntilIndexed({ txId: broadcastResult.txId });
  
//     console.log('follow with broadcast: has been indexed', result);
  
//     const logs = indexedResult!.txReceipt!.logs;
  
//     console.log('follow with broadcast: logs', logs);
//   };
  