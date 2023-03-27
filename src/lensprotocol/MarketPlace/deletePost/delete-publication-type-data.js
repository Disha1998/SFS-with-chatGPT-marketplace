import { gql } from '@apollo/client'
import { apolloClient } from '../../services/ApolloClient';

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
        publicationId: data.id, 
     };
    const result = await deletePub(request); 
    return result;
  };
