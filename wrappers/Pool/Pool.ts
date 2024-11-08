import { Address, Cell, Contract, ContractProvider, Sender, SendMode, toNano } from '@ton/core';
import {
    DepositStakeParams,
    getDepositStakeMessageBody,
    getRecoverStakeMessageBody,
    getWithdrawStakeMessageBody,
    RecoverStakeParams,
    WithdrawStakeParams,
} from './utils/message-constructors';

export class Pool implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Pool(address);
    }

    async getConfigExtra(provider: ContractProvider): Promise<ConfigExtra> {
        const result = await provider.get('get_params', []);
        return {
            Enabled: result.stack.readBoolean(),
            UpgradesEnabled: result.stack.readBoolean(),
            MinStake: result.stack.readBigNumber(),
            DepositFee: result.stack.readBigNumber(),
            WithdrawFee: result.stack.readBigNumber(),
            PoolFee: result.stack.readBigNumber(),
            ReceiptPrice: result.stack.readBigNumber(),
        };
    }

    async sendWithdrawStaked(provider: ContractProvider, via: Sender, opts: WithdrawStakeParams) {
        const PoolConfigExtra = await this.getConfigExtra(provider);
        const withdrawExactValue = PoolConfigExtra.WithdrawFee + PoolConfigExtra.ReceiptPrice;
        if (opts.value === undefined) {
            opts.value = withdrawExactValue;
        }
        if (opts.value != withdrawExactValue) {
            throw new RangeError(`sent amount must be more than stake fee (${withdrawExactValue}): ${opts.value}`);
        }
        return await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: getWithdrawStakeMessageBody(opts),
        });
    }

    async sendDepositStake(provider: ContractProvider, via: Sender, opts: DepositStakeParams) {
        const PoolConfigExtra = await this.getConfigExtra(provider);
        const depositMinValue = PoolConfigExtra.DepositFee + PoolConfigExtra.ReceiptPrice;
        if (opts.value === undefined) {
            throw new RangeError(`sent amount must be more than stake fee (${depositMinValue}): ${opts.value}`);
        }
        if (opts.value < depositMinValue) {
            throw new RangeError(`sent amount must be more than stake fee (${depositMinValue}): ${opts.value}`);
        }
        return await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: getDepositStakeMessageBody(opts),
        });
    }

    async sendRecoverStake(provider: ContractProvider, via: Sender, opts: RecoverStakeParams) {
        if (opts.value === undefined) {
            opts.value = toNano('2.0');
        }
        if (opts.value < toNano('2.0')) {
            throw new RangeError(`sent amount must be more than stake fee (${toNano('2.0')}): ${opts.value}`);
        }
        return provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: getRecoverStakeMessageBody(opts),
        });
    }
}

export type ConfigExtra = {
    Enabled: boolean;
    UpgradesEnabled: boolean;
    MinStake: bigint;
    DepositFee: bigint;
    WithdrawFee: bigint;
    PoolFee: bigint;
    ReceiptPrice: bigint;
    value?: bigint;
    queryId?: number;
};
