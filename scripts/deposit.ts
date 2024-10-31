import { NetworkProvider } from '@ton/blueprint';
import { toNano } from '@ton/core';
import { Pool } from '../wrappers/Pool/Pool';
import {POOL_ADDRESS} from "../wrappers/Pool/constants";
export async function run(provider: NetworkProvider) {
    const pool = provider.open(Pool.createFromAddress(POOL_ADDRESS));

    await pool.sendDepositStake(provider.sender(),
        {
            value: toNano(50),
            queryId: Date.now()
        }
    );
}
