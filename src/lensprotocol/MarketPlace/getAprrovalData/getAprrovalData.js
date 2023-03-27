import { gql } from "@apollo/client";
import { apolloClient } from "../../services/ApolloClient";
import {sendTx } from "../../services/ethers-service";

const GET_MODULE_CURRENCY_APRROVAL_DATA = `
query EnabledModuleCurrencies {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`


const GET_APRROVAL_DATA = `
query generateModuleCurrencyApprovalData($request: GenerateModuleCurrencyApprovalDataRequest!) {
    generateModuleCurrencyApprovalData(request: $request) {
      to
      from
      data
    }
  }
`



const enabledCurrenciesRequest = async () => {
    const result = await apolloClient.query({
        query: gql(GET_MODULE_CURRENCY_APRROVAL_DATA)
    });

    return result.data.enabledModuleCurrencies;
};

export const enabledCurrencies = async () => {
    // const address = getAddress();
    // console.log('enabled currencies: address', address);

    // await login(address);

    const result = await enabledCurrenciesRequest();

    return result;
};





const getModuleApprovalData = async (request) => {
    const result = await apolloClient.query({
        query: gql(GET_APRROVAL_DATA),
        variables: { request }
    });

    return result;
};



export const approveModule = async (val) => {

    const currencies = await enabledCurrencies();
    console.log('vcurrencies', currencies);


    const generateModuleCurrencyApprovalData = await getModuleApprovalData
        ({
            currency: currencies.map((c) => c.address)[0],
            value: val,
            collectModule: "LimitedFeeCollectModule",
        });
    console.log('approve module: result', generateModuleCurrencyApprovalData);
        const dataa = generateModuleCurrencyApprovalData
        console.log(dataa);
    const tx = await sendTx({
        to: generateModuleCurrencyApprovalData.data.generateModuleCurrencyApprovalData.to,
        from: generateModuleCurrencyApprovalData.data.generateModuleCurrencyApprovalData.from,
        data: generateModuleCurrencyApprovalData.data.generateModuleCurrencyApprovalData.data,
    });

    console.log('approve module: txHash', tx.hash);

    await tx.wait();

    console.log('approve module: txHash mined', tx.hash);
};