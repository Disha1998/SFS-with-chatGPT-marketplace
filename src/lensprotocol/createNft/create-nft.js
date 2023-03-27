
import { signedTypeData, splitSignature, getAddress } from '../services/ethers-service';
import { createPostTypedData } from '../post/create-post-type-data';
import { lensHub } from '../services/lens-hub';
import { v4 as uuidv4 } from 'uuid';
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed';
import { BigNumber, utils } from 'ethers';
import uploadIpfs from '../services/ipfs'
import { toast } from 'react-toastify';
import { createPostByDispatcher } from '../post/dispatcher/post-despatcher';



export const createNftPost = async (postData) => {
    console.log(postData,'create nft');
    try {
        const profileId = window.localStorage.getItem("profileId");
        // hard coded to make the code example clear
        if (!profileId) {
            toast.error('Please login first!');
            return;
        }
        var fType;
        var mType;
        var cType;

        if (postData.fileTyepe === 'image') {
            fType = 'IMAGE';
            mType = postData.photo;
            cType = 'image/jpeg';
        } else if (postData.fileTyepe === 'video') {
            fType = 'VIDEO';
            mType = postData.video;
            cType = 'video/mp4';
        } else {
            fType = 'TEXT_ONLY';
            mType = null;
            cType = null;
        }

        const address = await getAddress();
        await postData.login(address);

        var ipfsData;

        if (fType !== 'TEXT_ONLY') {
            ipfsData = JSON.stringify({
                version: '2.0.0',
                metadata_id: uuidv4(),
                description: postData.description,
                content: postData.title,
                locale: 'en-US',
                external_url: null,
                contentWarning: null,
                image: null,
                imageMimeType: null,
                name: postData.name ? postData.name : postData.handle,
                attributes: [],
                mainContentFocus: fType,
                media: [
                    {
                        item: mType,
                        type: cType
                    }
                ],
                appId: 'supernft',
                animation_url: null,
            });
        } else {
            ipfsData = JSON.stringify({
                version: '2.0.0',
                metadata_id: uuidv4(),
                description: postData.description,
                content: postData.title,
                locale: 'en-US',
                external_url: null,
                image: null,
                imageMimeType: null,
                name: postData.name ? postData.name : postData.handle,
                attributes: [],
                mainContentFocus: fType,
                appId: 'supernft',
            });
        }

        const ipfsResult = await uploadIpfs(ipfsData);
        const createPostRequest = {
            profileId,
            contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
            collectModule: {
                limitedFeeCollectModule: {
                    collectLimit:postData.noOfNFTs,
                    amount: {
                        currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                        value: postData.amount
                    },
                    recipient: address,
                    referralFee: 0,
                    followerOnly: false
                }
            },
            referenceModule: {
                followerOnlyReferenceModule: false
            }
        };
        console.log(createPostRequest);

        const result = await createPostTypedData(createPostRequest);
        console.log(result,'result');

        const typedData = result.data.createPostTypedData.typedData;
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);

        const { v, r, s } = splitSignature(signature);

        const tx = await lensHub.postWithSig({
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        });

        const indexedResult = await pollUntilIndexed(tx.hash);
        const logs = indexedResult.txReceipt.logs;
        const topicId = utils.id(
            'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
        );

        const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);

        let profileCreatedEventLog = profileCreatedLog.topics;
        const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

        toast.success("Successfully post is created!")
        return result.data;

    } catch (error) {
        toast.error(error);
    }

}


export const createNftPostViaDis = async (postData) => {
    try {
        const profileId = window.localStorage.getItem("profileId");

        if (!profileId) {
            toast.error('Please login first!');
            return;
        }

        const address = await getAddress();
        var fType;
        var mType;
        var cType;

        if (postData.fileTyepe === 'image') {
            fType = 'IMAGE';
            mType = postData.photo;
            cType = 'image/jpeg';
        } else if (postData.fileTyepe === 'video') {
            fType = 'VIDEO';
            mType = postData.video;
            cType = 'video/mp4';
        } else {
            fType = 'TEXT_ONLY';
            mType = null;
            cType = null;
        }

        var ipfsData;

        await postData.login(address);
        if (fType !== 'TEXT_ONLY') {
            ipfsData = JSON.stringify({
                version: '2.0.0',
                metadata_id: uuidv4(),
                description: postData.description,
                content: postData.title,
                locale: 'en-US',
                external_url: null,
                contentWarning: null,
                tags: postData.tags,
                image: null,
                imageMimeType: null,
                name: postData.name ? postData.name : postData.handle,
                attributes: [],
                mainContentFocus: fType,
                media: [
                    {
                        item: mType,
                        type: cType
                    }
                ],
                appId: 'supernft',
                animation_url: null,
            });
        } else {
            ipfsData = JSON.stringify({
                version: '2.0.0',
                metadata_id: uuidv4(),
                description: postData.description,
                content: postData.title,
                locale: 'en-US',
                external_url: null,
                tags: postData.tags,
                image: null,
                imageMimeType: null,
                name: postData.name ? postData.name : postData.handle,
                attributes: [],
                mainContentFocus: fType,
                appId: 'supernft',
            });
        }

        const ipfsResult = await uploadIpfs(ipfsData);

        const createPostRequest = {
            profileId,
            contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
            collectModule: {
                limitedFeeCollectModule: {
                    collectLimit:postData.noOfNFTs,
                    amount: {
                        currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                        value: postData.amount
                    },
                    recipient: address,
                    referralFee: 0,
                    followerOnly: false
                }
            },
            referenceModule: {
                followerOnlyReferenceModule: false
            }
        };
        const result = await createPostByDispatcher(createPostRequest);
        const indexedResult = await pollUntilIndexed(result?.data?.createPostViaDispatcher?.txHash);
        console.log(indexedResult, "indexedResult");
        const logs = indexedResult.txReceipt.logs;
        const topicId = utils.id(
            'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
        );
        const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
        let profileCreatedEventLog = profileCreatedLog.topics;
        const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];
        return result;
    } catch (err) {
        return err;
    }
}