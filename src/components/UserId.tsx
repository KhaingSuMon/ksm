"use client";

import { getDeviceInfo } from "@/lib/hardwareInfo";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserReqInfo } from "./UserReqInfoProvider";
import { checkRealLikeDeviceExist } from "@/db/query/realLikeDevices";
import { createDeviceFingerprint } from "@/db/query/deviceFingerprint";
import { initCount } from "@/db/query/allLikesCount";

const DeviceLikedContext = React.createContext({
  digestId: "",
  liked: false,
  setLiked: () => undefined,
});

export const UserId = ({
  reqInfo,
  children,
}: {
  reqInfo: UserReqInfo;
  children: React.ReactNode;
}) => {
  const [deviceLiked, setDeviceLiked] = useState(false);
  const [digestId, setDigestId] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const { digest, info } = await getDeviceInfo();
        const isExist = await checkRealLikeDeviceExist(digest);

        if (isExist) setDeviceLiked(true);

        const res = await createDeviceFingerprint({
          ...info,
          ...reqInfo,
          digestId: digest,
        });

        if (res) {
          setDigestId(res);
        }
        initCount();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      digestId,
      liked: deviceLiked,
      setLiked: () => {
        setDeviceLiked(true);
        return undefined;
      },
    }),
    [deviceLiked, setDeviceLiked, digestId]
  );
  return (
    <DeviceLikedContext.Provider value={value}>
      {children}
    </DeviceLikedContext.Provider>
  );
};

export const useDeviceLiked = () => useContext(DeviceLikedContext);
