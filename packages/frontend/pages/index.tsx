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
  const [isIdentifiedBinance, setIsIdentifiedBinance] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [selectProvider, setSelectProvider] = useState('Binance');

  const getTokens = async () => {
    const tokens = await fetchTokens();
    if (tokens) {
      setFromToken(tokens[0].symbol);
      if (tokens.length > 1) setToToken(tokens[1].symbol);
      setTokensList(tokens);
    }
  };
  const getIdentifiedBinance = async () => {
    const result = await fetchIdentities(address);
    if (result) {
      if (
        result[0].data?.providers?.find(
          (provider: Provider) => provider.symbol === "BABT"
        )?.result
      ) {
        setIsIdentifiedBinance(true);
      }
    }
  };
  const getQuotes = async (amount: number | undefined, transactionSide: string) => {
    if (fromToken && toToken && amount) {
      const quotes = await fetchQuotes(
        fromToken,
        toToken,
        Math.round(amount) < 1 ? 1 : Math.round(amount)
      );
      if (quotes) {
        setQuotes(quotes)
        if (transactionSide === "from") {
          setValueTo(quotes[1].status === "SUCCESS" ? Math.round(quotes[1].data.toAmount) : null)
        } else {
          setValueFrom(quotes[1].status === "SUCCESS" ? Math.round((amount / (quotes[1].data.toAmount / amount))) : null)
        }
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
      getIdentifiedBinance();
    }
  }, [isConnected, address]);

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
          <div className={styles.providers_section}>
            <button
              disabled={!isIdentifiedBinance}
              className={(selectProvider === "Binance") ? styles.providers_section__active : styles.providers_section__inactive}
              onClick={() => { setSelectProvider("Binance") }}>
              Binance
            </button>
            <button
              className={(selectProvider === "1Inch") ? styles.providers_section__active : styles.providers_section__inactive}
              onClick={() => { setSelectProvider("1Inch") }}>
              1Inch
            </button>
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
                getQuotes(valueFrom || undefined, "from");
              }}
            ></input>
            <div style={{ flexGrow: 1 }}></div>
            <select
              onChange={(event) => {
                const value = event.target.value;
                if (value === toToken) setToToken(fromToken);
                setFromToken(value);
                setValueFrom(null)
                setValueTo(null)
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
            {/* <p></p> */}
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
                getQuotes(valueTo || undefined, "to");
              }}
            ></input>
            <div style={{ flexGrow: 1 }}></div>
            <select
              onChange={(event) => {
                setToToken(event.target.value);
                setValueFrom(null)
                setValueTo(null)
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
          <div className={styles.details_section}>
            <div>
              {(valueFrom && valueTo) && valueFrom} {fromToken && fromToken} {(valueFrom && valueTo) ? "=" : "->"} {(valueFrom && valueTo) && valueTo} {toToken && toToken}
            </div>
            {quotes?.length && quotes[1]?.status === "FAILED" && <div> FAILED </div>}
            {quotes?.length && quotes[1]?.status === "SUCCESS" && (valueFrom && valueTo) && <div>{` GAS: ${quotes[1]?.data.gas}`}</div>}
            
          </div>
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
