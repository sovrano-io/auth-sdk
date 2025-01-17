import { Contract, OperationJson, Provider } from "koilib";
import { getConfig } from "./config";

export class Account {

    public address: string;
    public provider: Provider;

    constructor(props: {
        address: string,
        provider: Provider
    }) {
        this.address = props.address;
        this.provider = props.provider;
    }

    async allow(props: {
        operation: OperationJson,
        validationContractId?: string
    }) {
        const validation_module_contract = new Contract({
            id: props.validationContractId ?? getConfig().modValidationAnyContractId,
            provider: this.provider
        });
    
        await validation_module_contract.fetchAbi();
    
        const { operation: allow } = await validation_module_contract.functions["allow"]({
            user: this.address,
            operation: {
                contract_id: props.operation.call_contract!.contract_id,
                entry_point: props.operation.call_contract!.entry_point,
                args: props.operation.call_contract!.args
            }
        }, { onlyOperation: true });
    
        return allow;
    }
    
    async execute(props: {
        operation: OperationJson,
        mode?: string
    }) {
        const contract = new Contract({
            id: this.address,
            provider: this.provider
        });
    
        await contract.fetchAbi();
    
        const { operation: exec } = await contract.functions[props.mode ?? "execute_user"]({
            operation: {
                contract_id: props.operation.call_contract!.contract_id,
                entry_point: props.operation.call_contract!.entry_point,
                args: props.operation.call_contract!.args
            }
        }, { onlyOperation: true });
    
        return exec;
    }
}