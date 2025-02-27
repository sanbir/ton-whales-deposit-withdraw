import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { POOL_ADDRESS } from '../wrappers/Pool/constants';
export async function run(provider: NetworkProvider) {
    const pool = provider.open(Pool.createFromAddress(POOL_ADDRESS));

    const poolParameters = await pool.getConfigExtra();

    const members = await pool.getMembersRaw();

    console.log(members);
}
