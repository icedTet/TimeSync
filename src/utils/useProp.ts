import { useState, useEffect, useCallback, useContext } from "react";
import { EventEmitter } from "stream";
import { useSelf } from "./ClientsideHelpers/useSelf";
import { fetcher } from "./fetcher";

const APIMap = new Map<string, APIMapValue>();
type APIMapValue = {
  value: Promise<Response | null>;
  lastUpdate: number;
};

class APIManager {
  static instance: APIManager;
  static fetchingMap = new Map<string, Promise<Response | null>>();
  static getInstance() {
    if (!APIManager.instance) APIManager.instance = new APIManager();
    return APIManager.instance;
  }
  constructor() {}
  cachedFetch(url: string, requestInit?: RequestInit, cacheLife = 300) {
    // if it is cached, return it
    const cached = APIMap.get(url);
    if (cached && cached.lastUpdate + cacheLife > Date.now()) {
      return cached.value;
    }
    // if it is fetching, wait for it
    if (APIManager.fetchingMap.has(url)) {
      return APIManager.fetchingMap.get(url)?.then((x) => x?.clone() || null);
    }
    // if it is not fetching, fetch it
    const resp = fetcher(`${url}`, requestInit).catch((e) => {
      console.error(e);
      return null;
    });
    APIManager.fetchingMap.set(
      url,
      resp.then(async (x) => {
        let value = x?.clone() || null;
        APIMap.set(url, {
          value: Promise.resolve(value?.clone() || null),
          lastUpdate: Date.now(),
        });
        APIManager.fetchingMap.delete(url);
        return value;
      })
    );
    return resp;
  }
}
/**
 *
 * @param prop Prop Type
 * @returns value. undefined = unloaded, null=404, T=prop
 */
export const useAPIProp = <T>(options: {
  APIPath?: string;
  requestInit?: RequestInit;
  cacheable?: boolean;
  defaultValue?: T;
  cacheLife?: number;
}) => {
  const { APIPath, requestInit, cacheable, defaultValue } = options;
  const user = useSelf();
  const cacheLife = options.cacheLife || 1000 * 60 * 60 * 24;
  const [value, setValue] = useState(
    defaultValue || (undefined as null | undefined | T)
  );
  const [error, setError] = useState(undefined as null | undefined | string);
  const update = useCallback(async () => {
    if (!APIPath) return null;
    const resp = await APIManager.getInstance()
      .cachedFetch(
        `${APIPath}`,
        requestInit,
        cacheable ? cacheLife || 1000 * 60 : 0
      )
      ?.catch((e) => {
        console.error(e);
        return null;
      });
    if (!resp) return setValue(null);
    if (!resp.ok) {
      setError(`${resp.status} ${await resp.text()}`);
      return setValue(null);
    }
    const json = await resp.json();
    setValue(json);
  }, [APIPath, requestInit]);

  useEffect(() => {
    update();
    console.log("useAPIProp", APIPath, requestInit, cacheable, user);
  }, [APIPath, requestInit, user]);
  return [value, update, error] as [
    null | undefined | T,
    () => Promise<void>,
    null | undefined | string
  ];
};
