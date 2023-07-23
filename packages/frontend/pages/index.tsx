import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { getAccount } from "@wagmi/core";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { fetchTokens, fetchIdentities, fetchQuotes } from "../utils/api";

interface Token {
  name: string;
  symbol: string;
  decimals: number;
  rateSymbol: string;
  address: string;
  chainId: number;
}

interface Identity {
  name: string;
  data: {};
}

interface Provider {
  name: string;
  symbol: string;
  source: string;
  timestamp: number;
  status: string;
  contract: string;
  result: boolean;
  chainId: number;
  sync: {
    enabled: boolean;
    sourceId: string;
    byChainIds: {
      chainId: number;
      timestamp: number;
      syncTimestamp: number;
      expirationTimestamp: number;
      required: boolean;
    }[];
  };
}

const Home: NextPage = () => {
  const { address, isConnected } = getAccount();

  const [isConnect, setIsConnect] = useState(false);
  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<string>();
  const [toToken, setToToken] = useState<string>();
  const [valueFrom, setValueFrom] = useState<number | null>(null);
  const [valueTo, setValueTo] = useState<number | null>(null);
  const [isIdentified, setIsIdentified] = useState(false);
  const [quotes, setQuotes] = useState([]);

  const getTokens = async () => {
    const tokens = await fetchTokens();
    if (tokens) {
      setFromToken(tokens[0].symbol);
      if (tokens.length > 1) setToToken(tokens[1].symbol);
      setTokensList(tokens);
    }
  };
  const getIdentified = async () => {
    const result = await fetchIdentities(address);
    if (result) {
      if (
        result[0].data?.providers?.find(
          (provider: Provider) => provider.symbol === "BABT"
        )?.result
      ) {
        setIsIdentified(true);
      }
    }
  };
  const getQuotes = async (amount: number | undefined) => {
    if (fromToken && toToken && amount) {
      const quotes = await fetchQuotes(fromToken, toToken, amount);
      if (quotes) {
        console.log("quotes", quotes);
      }
    }
  };

  useEffect(() => {
    if (!tokensList.length) {
      getTokens();
    }
  }, []);
  useEffect(() => {
    setIsConnect(isConnected);
    if (isConnected && address) {
      getIdentified();
    }
  }, [isConnected]);

  return (
    <div className={styles.container}>
      <Head>
        <title>ChadSwap</title>
        <meta content="Swap from Metasvit" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <header>
        <div style={{ display: "flex" }}>
          <h2>ChadSwap</h2>
          <div style={{ flexGrow: 1 }}></div>
          <div style={{ paddingTop: 20 }}>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.dialog}>
          <div className={styles.head_section}>
            <h1>Swap</h1>
          </div>
          <div className={styles.from_section}>
            <input
              placeholder="0.00"
              value={valueFrom || ""}
              onChange={(e: any) => {
                if (!isNaN(e.target.value.trim())) {
                  setValueFrom(e.target.value.trim());
                }
              }}
              onBlur={() => {
                getQuotes(valueFrom || undefined);
              }}
            ></input>
            <div style={{ flexGrow: 1 }}></div>
            <select
              onChange={(event) => {
                const value = event.target.value;
                if (value === toToken) setToToken(fromToken);
                setFromToken(value);
              }}
            >
              {tokensList?.length &&
                tokensList.map((item) => (
                  <option
                    key={item.symbol}
                    value={item.symbol}
                    selected={fromToken === item.symbol}
                  >
                    {item.symbol}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.turn_over_section}>
            <button></button>
          </div>
          <div className={styles.to_section}>
            <input
              placeholder="0.00"
              value={valueTo || ""}
              onChange={(e: any) => {
                if (!isNaN(e.target.value.trim())) {
                  setValueTo(e.target.value.trim());
                }
              }}
              onBlur={() => {
                getQuotes(valueTo || undefined);
              }}
            ></input>
            <div style={{ flexGrow: 1 }}></div>
            <select
              onChange={(event) => {
                setToToken(event.target.value);
              }}
            >
              {tokensList.length &&
                tokensList
                  .filter((item) => item.symbol !== fromToken)
                  .map((item) => (
                    <option
                      key={item.symbol}
                      value={item.symbol}
                      selected={toToken === item.symbol}
                    >
                      {item.symbol}
                    </option>
                  ))}
            </select>
          </div>
          <div className={styles.details_section}></div>
          <div className={styles.button_section}>
            {!isConnect ? (
              <ConnectButton />
            ) : (
              <div>
                <button
                  className={styles.button_section__button}
                  onClick={() => {
                    console.log("swap", fromToken, toToken, valueFrom, valueTo);
                  }}
                >
                  Swap
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://metasvit.io" rel="noopener noreferrer" target="_blank">
          Made by Metasvit
        </a>
      </footer>
    </div>
  );
};

export default Home;
