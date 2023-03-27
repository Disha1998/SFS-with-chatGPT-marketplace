import { gql } from "@apollo/client";
import { apolloClient } from "../../services/ApolloClient"; 


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
 