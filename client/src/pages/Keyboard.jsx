import React, { useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const Keyboard = () => {
  useEffect(async () => {
    try {
      const token = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/checkToken`
      );
      console.log(token.data.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <div>키보드 페이지</div>
    </>
  );
};

export default Keyboard;
