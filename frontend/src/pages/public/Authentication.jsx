import React, { useState } from 'react';
import Register from "../../components/auth/Register.jsx";
import Login from "../../components/auth/Login.jsx";

function Authentication() {
  const [login, setLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text font-text">
      {login ? <Login setLogin={setLogin} /> : <Register setLogin={setLogin} />}
    </div>
  );
}

export default Authentication;

