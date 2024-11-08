import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { AMOUNT_DEPOSIT, POOL_ADDRESS } from '../wrappers/Pool/constants';
export async function run(provider: NetworkProvider) {
    const pool = provider.open(Pool.createFromAddress(POOL_ADDRESS));

    const poolParameters = await pool.getConfigExtra();

    // deposit + fees
    const messageValue = AMOUNT_DEPOSIT + poolParameters.DepositFee + poolParameters.ReceiptPrice;

    await pool.sendDepositStake(provider.sender(), {
        value: messageValue,
        queryId: Date.now(),
    });
}
