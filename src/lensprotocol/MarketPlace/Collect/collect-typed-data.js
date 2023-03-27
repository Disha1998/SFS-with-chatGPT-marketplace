import { gql } from '@apollo/client'
import { apolloClient } from '../../services/ApolloClient'

const CREATE_COLLECT_TYPED_DATA = `
mutation($request:CreateCollectRequest!){
    createCollectTypedData(request:$request) {
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

export const createCollectTypedDataNft = (createCollectTypedDataRequest) => {
    return apolloClient.mutate({
     mutation: gql(CREATE_COLLECT_TYPED_DATA),
     variables: {
       request: createCollectTypedDataRequest
     },
   })
 }


 export const collectNft = async (createCollectReaquest) => {
  const result = await createCollectTypedDataNft(createCollectReaquest);
    console.log('create collect result', result);
    return result;
 }
