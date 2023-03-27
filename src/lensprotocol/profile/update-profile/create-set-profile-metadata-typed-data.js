 
import { gql } from '@apollo/client'
import { apolloClient } from '../../services/ApolloClient';

const CREATE_SET_PROFILE_METADATA_TYPED_DATA = `
  mutation($request: CreatePublicSetProfileMetadataURIRequest!) { 
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
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
          metadata
        }
      }
    }
  }
`;

export const createSetProfileMetadataTypedData = (profileId, metadata) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_SET_PROFILE_METADATA_TYPED_DATA),
    variables: {
      request: {
        profileId,
        metadata,
      },
    },
  });
};