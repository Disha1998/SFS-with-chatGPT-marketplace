import React, { useState, createContext, useEffect } from "react";
import { profileById } from "./query";
import jwt_decode from "jwt-decode";
import { apolloClient } from "../lensprotocol/services/ApolloClient";
import { gql } from "urql";
import { signText, getAddress } from "../lensprotocol/services/ethers-service";
import { posts } from "../lensprotocol/post/get-post";
import { getPublicationByLatest } from "../lensprotocol/post/explore/explore-publications";
import { toast } from "react-toastify";
import { profileByAddress } from "../lensprotocol/profile/get-profile";
import { collectedPubByAddress, getNFTCommentsByLatest, getNFTMirrorByLatest, getNftPostByPubId, getNFTPublicationByLatest } from "../lensprotocol/MarketPlace/getNftPost/GetNftPost";
import axios from 'axios';


export const LensAuthContext = createContext(undefined);
export const LensAuthContextProvider = (props) => {
  const [open, setOpen] = useState(false);
  const [userAdd, setUserAdd] = useState("");
  const [profile, setProfile] = useState("");
  const [update, setUpdate] = useState(false);
  const [likeUpdate, setLikeUpdate] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [NFTPosts, setNFTPosts] = useState([]);
  const [NFTCollected, setNFTCollected] = useState([]);
  // console.log(NFTCollected,'nft coll');
  const [NFTMirroredPost, setNFTMirroredPosts] = useState([]);
  const id = window.localStorage.getItem("profileId");
  const [updatePro, setUpdatePro] = useState(false)


  useEffect(() => {
    async function getProfile() {
      if (id !== null) {
        const user = await profileById(id);
        setProfile(user);
        const nftPosts = await getNFTPublicationByLatest();
        setNFTPosts(nftPosts);

        const nftMirror = await getNFTMirrorByLatest();
        setNFTMirroredPosts(nftMirror);
        const collects = await collectedPubByAddress()
        let arr = []
        for (let i = 0; i < collects[0].length; i++) {

          if (collects[0][i].appId === "supernft") {
            arr.push(collects[0][i]);
          }
        }
        setNFTCollected(arr);
      }


    };
    getProfile();
    getPosts();
  }, [userAdd, update, updatePro]);


  async function getPosts() {
    let array = [];
    const post = await posts(id);
    const data = await getPublicationByLatest();
    const latestPosts = data.data && data.data.explorePublications.items.map((e) => {
      // array.push(e);
      return e;
    })
    setUserPosts(latestPosts);
  }

  const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

  const authenticate = (address, signature) => {
    return apolloClient.mutate({
      mutation: gql(AUTHENTICATION),
      variables: {
        request: {
          address,
          signature,
        },
      },
    });
  };

  const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;

  const generateChallenge = (address) => {
    return apolloClient.query({
      query: gql(GET_CHALLENGE),
      variables: {
        request: {
          address,
        },
      },
    });
  };

  const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

  const refreshAuth = (refreshToken) => {
    return apolloClient.mutate({
      mutation: gql(REFRESH_AUTHENTICATION),
      variables: {
        request: {
          refreshToken,
        },
      },
    });
  };

  const refresh = async () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    const accessToken = window.localStorage.getItem("accessToken");

    if (accessToken === null || accessToken === "undefined") {
      return false;
    }

    let decodedRefresh = jwt_decode(refreshToken);
    let decodedAccess = jwt_decode(accessToken);

    //Check if the accessToken is expired or not
    if (decodedAccess.exp > Date.now() / 1000) {
      return true;
    }

    //Check if the RefreshToken is valid, if yes we refresh them.
    if (decodedRefresh.exp > Date.now() / 1000) {
      try {
        const newAccessToken = await refreshAuth(
          refreshToken
        );
        window.localStorage.setItem("accessToken", newAccessToken.data.refresh.accessToken);
        window.localStorage.setItem("refreshToken", newAccessToken.data.refresh.refreshToken);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    return false;
  };


  function disconnectWallet() {
    // web3Modal.clearCachedProvider();
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("profileId");
    setUpdate(!update)
    window.location.reload();

  }



  const login = async () => {
    try {
      const address = await getAddress();
      setUserAdd(address);
      const isTokenValid = await refresh();
      if (isTokenValid) {
        // console.log("login: already logged in");
        return;
      }
      const challengeResponse = await generateChallenge(address);
      const signature = await signText(challengeResponse.data.challenge.text);
      const accessTokens = await authenticate(address, signature);
      const profiles = await profileByAddress(address);
      if (profiles === undefined) {
        toast.error("Please create a Profile");
        // web3Modal.clearCachedProvider();
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("profileId");
        setUpdate(!update)
      } else {
        window.localStorage.setItem("profileId", profiles?.id);
        setUpdate(!update)
        window.localStorage.setItem("accessToken", accessTokens.data.authenticate.accessToken);
        window.localStorage.setItem("refreshToken", accessTokens.data.authenticate.refreshToken);
      }

    } catch (error) {
      toast.error(error);
    }

  };


  const loginCreate = async () => {
    const address = await getAddress();
    const isTokenValid = await refresh();
    if (isTokenValid) {
      console.log("login: already logged in");
      return;
    }
    const challengeResponse = await generateChallenge(address);
    const signature = await signText(challengeResponse.data.challenge.text);
    const accessTokens = await authenticate(address, signature);
    window.localStorage.setItem("accessToken", accessTokens.data.authenticate.accessToken);
    window.localStorage.setItem("refreshToken", accessTokens.data.authenticate.refreshToken);

  };

  const forDescGpt = async (prompt) => {
    axios
      .post("http://localhost:5555/chat", { prompt })
      .then((res) => {
        console.log('res--=-==---', res.data);
        // setDescription(res.data);
        //   setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }


  return (
    <LensAuthContext.Provider
      value={{
        userAdd,
        profile,
        login,
        update,
        disconnectWallet,
        userPosts,
        setUpdate,
        loginCreate,
        updatePro,
        setUpdatePro,
        open,
        setOpen,
        NFTPosts,
        NFTMirroredPost,
        NFTCollected,
        forDescGpt
      }}
      {...props}
    >
      {props.children}
    </LensAuthContext.Provider>
  );
}