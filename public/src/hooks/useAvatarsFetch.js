import axios from "axios";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";

export const useAvatarsFetch = () => {
  //logic
  const api = "https://api.multiavatar.com/45678945";
  const apiKey = process.env.REACT_APP_AVATAR_API_KEY;
  const [fetchCount, setFetchCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatars, setAvatars] = useState([""]);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchNow = async (url) => {
      const resp = await axios.get(url);
      const buffer = new Buffer(resp.data);
      //console.log(`URL:`, url);
      setData(buffer.toString("base64"));
    };

    const fetchFour = async () => {
      for (let i = 0; i < 4; i++) {
        const url = `${api}/${Math.round(
          Math.random() * 1000
        )}?apikey=${apiKey}`;
        await fetchNow(url);
      }
    };

    try {
      //console.log("API KEY:", apiKey);
      fetchFour();
    } catch (error) {
      //console.log(error);
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (!avatars[0]) {
        setAvatars([data]);
      } else {
        setAvatars([...avatars, data]);
      }
    }
  }, [data]);

  useEffect(() => {
    //console.log("data:", avatars);
    setFetchCount(avatars.length);
  }, [avatars]);

  useEffect(() => {
    //console.log("FetchCount:", fetchCount);
    if (fetchCount === 4) {
      setIsLoading(false);
    }
  }, [fetchCount]);

  return [avatars, isLoading, error];
};
