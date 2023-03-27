import { apolloClient } from '../services/ApolloClient';
import { gql } from '@apollo/client'

const HIDE_PUBLICATION=`
mutation ($request:  HidePublicationRequest!) {
    hidePublication(request: $request)
  }
`

const deletePub = (id) => {
    return apolloClient.query({
      query: gql(HIDE_PUBLICATION),
      variables: {
        request: id,
      },
    });
  };
  
  export const deletePublicaton = async (data) => {
    await data.login(data.address); 
    const request = {
        publicationId: data.id ? data.id : "0x40bf", 
     };
    const result = await deletePub(request); 
    return result;
  };

// { publicationId: "0x01-0x01" }