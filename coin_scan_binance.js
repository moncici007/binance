import axios from 'axios';
import { axiosConfig } from '@moncici/proxy';
import { sleep } from '@moncici/sleep';
import { formatTimestamp } from '@moncici/date-time-processor';
import { notify } from 'feishu-notifier';
import { log } from '@moncici/log';

const retryDuration = 1000;

export async function getPricesByCoins(symbols) {
  const url = `https://api.binance.com/api/v3/ticker/price?symbols=[${symbols}]`;

  try {
    const response = await axios.get(url, axiosConfig);
    if (response.status == 429) {
      sleep(retryDuration);
    }
    const data = response.data;
    log(`${formatTimestamp(new Date())} ${symbols} 实时价格：`, response.data);
    notify('', data);
    return data
  } catch(error) {
    log(`无法获取 ${symbols} USD 价格:`, error.response.data);
    notify('', error.response.data);
    throw error; // 将错误向上抛出
  }
}

export async function getPriceByCoin(symbol) {
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

  try {
    const response = await axios.get(url, axiosConfig);
    if (response.status == 429) {
      sleep(retryDuration);
    }
    const data = response.data;
    log(`${symbol} 实时价格：`, response.data);
    return data
  } catch(error) {
    log(`无法获取 ${symbol} USD 价格:`, error.response.data);
    throw error; // 将错误向上抛出
  }
}

// https://api.binance.com/api/v3/klines?interval=1m&limit=3&symbol=BTCUSDT
export async function getKlines(symbol) {
  const url = `https://api.binance.com/api/v3/klines?interval=5m&limit=3&symbol=${symbol}`;
  console.log(url);

  try {
    const response = await axios.get(url, axiosConfig);
    if (response.status == 429) {
      sleep(retryDuration);
    }
    const data = response.data;
    // console.log(`${symbol} 实时价格：`, response.data);
    return data
  } catch(error) {
    log(`无法获取 ${symbol} USD 价格:`, error.response.data);
    throw error; // 将错误向上抛出
  }
}

// getPricesByCoins(`"BTCUSDT","ETHUSDT","AVAXUSDT","ARBUSDT","LINKUSDT","MATICUSDT","OPUSDT","SOLUSDT"`);
// getPriceByCoin('ETHUSDT');