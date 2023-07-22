import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { getAccount } from '@wagmi/core'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import { fetchTokens, fetchIdentities, fetchQuotes } from '../utils/api';

interface Token {
  name: string;
  symbol: string;
  decimals: number;
  rateSymbol: string;
  address: string;
  chainId: number;
}

const Home: NextPage = () => {
  const { isConnected } = getAccount();

  const [isConnect, setIsConnect] = useState(false);
  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [valueFrom, setValueFrom] = useState<number | null>(null);
  const [valueTo, setValueTo] = useState<number | null>(null);

  useEffect(() => {
    setIsConnect(isConnected)
  }, [isConnected]);
  useEffect(() => {
    if (!tokensList.length) {
      const tokens = fetchTokens()
      console.log('tokens', tokens)
      // if (tokens)
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Swap App</title>
        <meta
          content="Swap from Metasvit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>


        <div className={styles.dialog}>
          <div className={styles.head_section}>
            <h1>
              Swap
            </h1>

          </div>
          <div className={styles.from_section}>
            {/* <h2>You pay</h2> */}
            <input
              placeholder='0.00'
              value={valueFrom || ""}
              onChange={(e: any) => {
                if (!isNaN(e.target.value.trim())) {
                  setValueFrom(e.target.value.trim())
                }
              }}
            >
            </input>
            <select name="token_from">
              {tokensList.length && tokensList.map(item => (
                <option value={item.symbol || " "}>item.symbol</option>
              ))}
            </select>
          </div>
          <div className={styles.turn_over_section}>
            <button></button>
          </div>
          <div className={styles.to_section}>
            {/* <h2>You receive</h2> */}
            <input
              placeholder='0.00'
              value={valueTo || ""}
              onChange={(e: any) => {
                if (!isNaN(e.target.value.trim())) {
                  setValueTo(e.target.value.trim())
                }
              }}
            >
            </input>
            <select name="token_from">
              {tokensList.length && tokensList.map(item => (
                <option value={item.symbol || " "}>item.symbol</option>
              ))}
            </select>
          </div>
          <div className={styles.details_section}>

          </div>
          <div className={styles.button_section}>
            {!isConnect
              ? <ConnectButton />
              : <div>
                <button>
                  Swap
                </button>
              </div>
            }

          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://metasvit.io" rel="noopener noreferrer" target="_blank" >
          Made by Metasvit
        </a>
      </footer>
    </div>
  );
};

export default Home;
