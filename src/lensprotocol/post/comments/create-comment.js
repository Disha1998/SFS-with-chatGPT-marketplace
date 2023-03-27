
import { getAddress, signedTypeData, splitSignature } from '../../services/ethers-service';
import uploadIpfs from '../../services/ipfs';
import { lensHub } from '../../services/lens-hub';
import { createCommentTypedData,comment } from './create-comment-typed-data';
import { v4 as uuidv4 } from 'uuid';
import { BigNumber, utils } from 'ethers';
import { pollUntilIndexed } from '../../indexer/has-transaction-been-indexed';
import { toast } from 'react-toastify';
import { getComments } from '../get-post';
import { getProfileById } from '../../profile/get-profile';
import { createBroadcast } from '../dispatcher/broadcast';

export const createComment = async (postData) => {
  try {
    const profileId = postData.profileId;
    if (!profileId) {
      toast.error('Please login first!');
      return;
    }


    await postData.login(postData.address);

    const ipfsData = JSON.stringify({
      version: '2.0.0',
      metadata_id: uuidv4(),
      description: postData.comment,
      content: postData.comment,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: `Comment by @ ${postData.user}`,
      attributes: [],
      media: [],
      appId: 'superfun',
      animation_url: null,
    });
    const ipfsResult = await uploadIpfs(ipfsData); 

    // hard coded to make the code example clear
    const createCommentRequest = {
      profileId,
      // remember it has to be indexed and follow metadata standards to be traceable!
      publicationId: postData.publishId,
      contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
      collectModule: {
        revertCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    const result = await createCommentTypedData(createCommentRequest); 
    const typedData = result.data.createCommentTypedData.typedData; 
    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
 

    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.commentWithSig({
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
    });
 
    const wait = await tx.wait(); 

    if (wait) {  
      const indexedResult = await pollUntilIndexed(tx.hash);

      // console.log('create comment: profile has been indexed', result);

      const logs = indexedResult.txReceipt.logs;

      // console.log('create comment: logs', logs);

      const topicId = utils.id(
        'CommentCreated(uint256,uint256,string,uint256,uint256,bytes,address,bytes,address,bytes,uint256)'
      );
      // console.log('topicid we care about', topicId);

      const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
      // console.log('create comment: created log', profileCreatedLog);

      let profileCreatedEventLog = profileCreatedLog.topics;
      // console.log('create comment: created event logs', profileCreatedEventLog);

      const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

      // console.log(
      //   'create comment: contract publication id',
      //   BigNumber.from(publicationId).toHexString()
      // );
      console.log(publicationId,"publicationId");
      return result.data;
    }
  } catch (error) {
    toast.error(error);
  }
}; 

export const createCommentByDis=async(postData)=>{

  const profileId = window.localStorage.getItem("profileId");
  // hard coded to make the code example clear
  if (!profileId) {
      toast.error('Please login first!');
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
    tags:[],
    appId: 'superfun', 
  });
  const ipfsResult = await uploadIpfs(ipfsData); 
  
  const createCommentRequest = {
    profileId,
    // remember it has to be indexed and follow metadata standards to be traceable!
    publicationId: postData.publishId,
    contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
    collectModule: {
      revertCollectModule: true,
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };

  const result = await comment(createCommentRequest); 
 
  const indexedResult = await pollUntilIndexed( result?.data?.createCommentViaDispatcher?.txHash);
 
  const logs = indexedResult.txReceipt?.logs;
 
  const topicId = utils.id(
    'CommentCreated(uint256,uint256,string,uint256,uint256,bytes,address,bytes,address,bytes,uint256)'
  ); 

  const profileCreatedLog = logs.find((l) => l.topics[0] === topicId); 

  let profileCreatedEventLog = profileCreatedLog?.topics; 

  const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];
 
  return result;
}