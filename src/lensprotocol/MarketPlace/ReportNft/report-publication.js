import { gql } from "@apollo/client"
import { apolloClient } from "../../services/ApolloClient";

const REPORT_PUBLICATION = `
mutation ($request : ReportPublicationRequest!) {
    reportPublication(request: $request)
  }
`
const reportPublicationRequest = (request) => {
    console.log('acha cha');
    return apolloClient.query({
        query:gql(REPORT_PUBLICATION),
        variables:{
            request,
        },
    });
}

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
    const response = await reportPublicationRequest(request); 
    return response.data.reportPublication;
}