import { gql } from "@apollo/client";
import { toast } from "react-toastify";
import { getProfileById } from "../../profile/get-profile";
import { apolloClient } from "../../services/ApolloClient";
import { signedTypeData } from "../../services/ethers-service";
import { createPostTypedData } from "../create-post-type-data";
import { createBroadcast } from "./broadcast";


const CREATE_POST_VIA_DISPATCHER = `
mutation($request: CreatePublicPostRequest!) {
    createPostViaDispatcher(request: $request) {
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

export const createPostByDis = (createPost) => { 
    return apolloClient.mutate({
        mutation: gql(CREATE_POST_VIA_DISPATCHER),
        variables: {
            request: createPost,
        },
    });
}

export const createPostByDispatcher = async (createPostRequest) => {

    const profileId = window.localStorage.getItem("profileId");
    const profileResult = await getProfileById(profileId); 
    if (!profileResult) {
        toast.error('Could not find profile');
        return;
    }

    // this means it they have not setup the dispatcher, if its a no you must use broadcast
    if (profileResult?.dispatcher?.canUseRelay) { 
        const dispatcherResult = await createPostByDis(createPostRequest); 
        if (dispatcherResult?.data?.createPostViaDispatcher?.__typename !== 'RelayerResult') {
            
            toast.error('create post via dispatcher: failed');
            return;
        }

        return dispatcherResult;
    } else {
        const result = await createPostTypedData(createPostRequest); 
        const typedData = result.data.createPostTypedData.typedData;
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
        
        const broadcastResult = await createBroadcast({
            id: result.id,
            signature: signature,
        }); 

        if (broadcastResult.__typename !== 'RelayerResult') { 
            toast.error('create post via broadcast: failed');
            return;
        }
 
        return broadcastResult;
    }
}
