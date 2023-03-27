import { apolloClient } from '../services/ApolloClient';
import { gql } from '@apollo/client'

const HIDE_PUBLICATION = `
mutation ($request : ReportPublicationRequest!) {
    reportPublication(request: $request)
  }
`

// {
//     publicationId: "0x01-0x01",
//     reason: {
//       sensitiveReason: {
//         reason: SENSITIVE,
//         subreason: OFFENSIVE
//       }
//     },
//     additionalComments: "Dislike this post"
//   }
const reportPublicationRequest = (request) => { 
    return apolloClient.query({
        query: gql(HIDE_PUBLICATION),
        variables: {
            request,
        },
    });
};
  
export const reportPublication = async (data) => {
    await data.login(data.address); 
    var request;
    // sensitiveReason, illegalReason , fraudReason

    if (data.reason === 'ILLEGAL') {
        request = {
            publicationId: data.id,
            reason: {
                illegalReason: {
                    reason:  data.reason,
                    subreason:  data.sub
                }
            },
            additionalComments: data.note
        }
    } else if (data.reason === 'SENSITIVE') {
        request = {
            publicationId: data.id,
            reason: {
                sensitiveReason: {
                    reason:  data.reason,
                    subreason:  data.sub
                }
            },
            additionalComments: data.note
        }
    } else {
        request = {
            publicationId: data.id,
            reason: {
                fraudReason: {
                    reason: data.reason,
                    subreason: data.sub,
                }
            },
            additionalComments: data.note
        }
    }

    // const request = {
    //     publicationId:  data.id,
    //     reason: {
    //         fraudReason :{
    //             reason : data.type,
    //             subreason: data.reason,
    //         }
    //     },
    //     additionalComments: data.note
    // }
    const response = await reportPublicationRequest(request); 
    return response.data.reportPublication;
}