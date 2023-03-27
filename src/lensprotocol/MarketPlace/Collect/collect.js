import { pollUntilIndexed } from "../../indexer/has-transaction-been-indexed";
import { getAddress, signedTypeData, splitSignature } from "../../services/ethers-service";
import { lensHub } from "../../services/lens-hub";
import { collectNft } from "./collect-typed-data";
import { approveModule } from "../getAprrovalData/getAprrovalData";


export const CollectItem = async (data) => {
    const profileId = data.proId;
    console.log(data);
    if (!profileId) {
        console.log('Please login first!');
        return;
    }
    await data.login(data.address);

    // const allow = await allowance();
    const result = await approveModule(data.value);
    console.log('allowance result',result);
    try {
        await data.login(data.address);
        const createCollectRequest = {
            publicationId: data.pubId,
        };
        console.log(createCollectRequest);
        const result = await collectNft(createCollectRequest);
        console.log(result);
        const typedData = result.data.createCollectTypedData.typedData;
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);

        const { v, r, s } = splitSignature(signature);

        const tx = await lensHub.collectWithSig(
            {
                collector: getAddress(),
                profileId: typedData.value.profileId,
                pubId: typedData.value.pubId,
                data: typedData.value.data,
                sig: {
                    v,
                    r,
                    s,
                    deadline: typedData.value.deadline,
                },
            },);
        const indexedResult = await pollUntilIndexed(tx.hash);
        alert('Item has been Collected!');

        return result.data;
    } catch (error) {
        console.log(error);
    }
};