import * as React from 'react';

import { signCreateCommentTypedDataNft,commentNft } from './comment-type-data';
import { v4 as uuidv4 } from 'uuid';
import { getAddress,signedTypeData,splitSignature } from '../../services/ethers-service';
import uploadIpfs from '../../services/ipfs';
import { lensHub } from '../../services/lens-hub';
import { pollUntilIndexed } from '../../indexer/has-transaction-been-indexed';
import { utils } from 'ethers';


export const DoCommentNft = async (cmntData) => {


    const profileId = window.localStorage.getItem("profileId");
    const address = await getAddress();
    console.log(address);
    await cmntData.login(address);

    var ipfsData;
    ipfsData = JSON.stringify({
        version: '2.0.0',
        mainContentFocus: 'TEXT_ONLY',
        metadata_id: uuidv4(),
        description: 'Description',
        locale: 'en-US',
        content: cmntData.comment,
        external_url: null,
        image: null,
        imageMimeType: null,
        name: 'Name',
        attributes: [],
        tags: [],
        appId: 'supernft',
    });
    const ipfsResult = await uploadIpfs(ipfsData);
    console.log(ipfsResult, "ipfsResult");
    // const publicationfromContext = publications[0].map((pub) => {
    //     return (
    //         pub.id
    //     )
    // })
    // console.log('id------', publicationfromContext);
    const createCommentRequests = {
        profileId,
        // remember it has to be indexed and follow metadata standards to be traceable!
        publicationId: cmntData.pubId,
        contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
        collectModule: {
            revertCollectModule: true,
        },
        referenceModule: {
            followerOnlyReferenceModule: false,
        },
    };
    console.log(createCommentRequests, "test");
    const result = await signCreateCommentTypedDataNft(createCommentRequests);
    console.log('result', result);

    const typedData = result.data.createCommentTypedData.typedData;
    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);

    const { v, r, s } = splitSignature(signature);



    const tx = await lensHub.commentWithSig(
        {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            referenceModuleData: typedData.value.referenceModuleData,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        },
        { gasLimit: 500000 }
    );

    console.log('tx hash', tx.hash);

    const indexedResult = await pollUntilIndexed(tx.hash);
    console.log('---------------------', indexedResult);


    const logs = indexedResult.txReceipt.logs;

    console.log(`$: logs`, logs);

    const topicId = utils.id(
        'CommentCreated(uint256,uint256,string,uint256,uint256,bytes,address,bytes,address,bytes,uint256)'
    );
    console.log('topicid we care about', topicId);

    const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
    console.log(`$: created log`, profileCreatedLog);

    let profileCreatedEventLog = profileCreatedLog.topics;
    console.log(`$: created event logs`, profileCreatedEventLog);

    const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

    return result;
}

export const commentGaslessNft = async (postData) => {

    const profileId = window.localStorage.getItem("profileId");
    if (!profileId) {
        console.log('Please login first!');
        return;
    }

    const address = await getAddress();
    await postData.login(address);
    const ipfsData = JSON.stringify({
        version: '2.0.0',
        metadata_id: uuidv4(),
        mainContentFocus: 'TEXT_ONLY',
        description: postData.comment,
        content: postData.comment,
        locale: 'en-US',
        external_url: null,
        image: null,
        imageMimeType: null,
        name: `Comment by @ ${postData.user}`,
        attributes: [],
        tags: [],
        appId: 'supernft',
    });
    const ipfsResult = await uploadIpfs(ipfsData);

    const createCommentRequest = {
        profileId,
        // remember it has to be indexed and follow metadata standards to be traceable!
        publicationId: postData.pubId,
        contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
        collectModule: {
            revertCollectModule: true,
        },
        referenceModule: {
            followerOnlyReferenceModule: false,
        },
    };

    const result = await commentNft(createCommentRequest);

    const indexedResult = await pollUntilIndexed(result?.data?.createCommentViaDispatcher?.txHash);

    const logs = indexedResult.txReceipt?.logs;

    const topicId = utils.id(
        'CommentCreated(uint256,uint256,string,uint256,uint256,bytes,address,bytes,address,bytes,uint256)'
    );

    const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);

    let profileCreatedEventLog = profileCreatedLog?.topics;

    const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

    return result;
}
export const BasicFun = async () => {
    console.log('basic fun');
}