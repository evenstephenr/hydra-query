import React, { useEffect } from "react";
import { useQuery } from "query";
import "./App.css";

const Showcase = ({ isLoading, error, errorCode, data }) => (
  <pre
    style={{
      height: "350px",
      borderTop: "1px solid black",
      overflow: "auto",
      width: "80%",
      resize: "vertical",
    }}
  >
    {JSON.stringify(
      {
        isLoading,
        data,
        errorCode,
        error,
      },
      null,
      2
    )}
  </pre>
);

export const App = () => {
  const { isLoading, data, error, errorCode, fetch } = useQuery({
    endpoint: "https://randomuser.me/api/",
  });

  const {
    isLoading: paramsLoading,
    data: paramsData,
    error: paramsError,
    errorCode: paramsErrorCode,
    fetch: fetchWithParams,
  } = useQuery({
    endpoint: "https://randomuser.me/api/",
    withCache: "randomuser-params-nat,inc",
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    fetchWithParams({
      params: {
        nat: "AU,US,NZ",
        inc: "nat,name,location,email,picture",
      },
    });
  }, [fetchWithParams]);

  console.log(data, paramsData);

  return (
    <div>
      <h3>useQuery</h3>
      <p>default use</p>
      <Showcase
        isLoading={isLoading}
        error={error}
        errorCode={errorCode}
        data={data}
      />
      <p>with Params (and withCache)</p>
      <Showcase
        isLoading={paramsLoading}
        error={paramsError}
        errorCode={paramsErrorCode}
        data={paramsData}
      />
    </div>
  );
};
