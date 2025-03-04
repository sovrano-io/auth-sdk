# Sovrano auth-sdk Documentation

The `auth-sdk` is designed to facilitate dApp integration with Sovrano, supporting authentication and authorization through redirects.

## Installation

To install the package, use:

```bash
npm install @sovrano-io/auth-sdk
```

## Main Functionalities

### 1. Signup

**Purpose:** Starts the account creation process on Sovrano.

#### Request Example

```typescript
import { Signup } from "@sovrano-io/auth-sdk";

const signupUrl = Signup.getRequestUrl({
    redirectUrl: "https://example.com/callback",
});

// Redirect the user to `signupUrl` to initiate registration
```

#### Handling Signup Response

Once the user completes the signup, they are redirected to the specified `redirectUrl` with the response.

```typescript
import { Signup } from "@sovrano-io/auth-sdk";

const responseUrl = "https://example.com/callback?data=encodedResponseData";
const signupResponse = Signup.getResponse(responseUrl);

if (signupResponse.type === "success") {
    console.log("Signup successful!");
    console.log("Address:", signupResponse.address);
    console.log("Nickname:", signupResponse.nickname);
} else {
    console.error("Error:", signupResponse.errorMessage);
    console.error("Error Code:", signupResponse.errorCode);
}
```

### 2. Connector

**Purpose:** Initiates the login process to connect the user's Sovrano account to the dApp.

#### Request Example

```typescript
import { Connector } from "@sovrano-io/auth-sdk";

const connectUrl = Connector.getRequestUrl({
    appName: "MyDApp",
    redirectUrl: "https://example.com/callback",
});

// Redirect the user to `connectUrl` for login
```

#### Handling Connector Response

Upon successful login, Sovrano redirects the user to `redirectUrl` with their account data.

```typescript
import { Connector } from "@sovrano-io/auth-sdk";

const responseUrl = "https://example.com/callback?data=encodedResponseData";
const connectResponse = Connector.getResponse(responseUrl);

if (connectResponse.type === "success") {
    console.log("Login successful!");
    console.log("Address:", connectResponse.address);
    console.log("Nickname:", connectResponse.nickname);
} else {
    console.error("Error:", connectResponse.errorMessage);
    console.error("Error Code:", connectResponse.errorCode);
}
```

### 3. Authorizer

**Purpose:** Sends an unsigned transaction to the user for authorization.

---

### Understanding Operation Authorization

To authorize an operation in Sovrano, a transaction is created with **two key operations**:

1. **Pre-authorization (Allowance)**: This operation records the pre-authorization details, presenting the operation for the user to review and sign.

2. **Execution**: This operation executes the authorized action if it has been pre-approved.

Both **validator modules** (for pre-authorization) and **executor modules** (for carrying out the operation) are installed within specific *scopes* in the user’s account. These scopes define when and under what conditions each module is activated. Validators are responsible for defining and enforcing rules on whether a particular transaction should proceed, while executor modules carry out the approved actions.

> For more details on modules, visit the official documentation:  
> [Veive Core Modules - Allowance](https://docs.veive.io/veive-docs/framework/core-modules/mod-allowance)

After constructing the transaction, it is signed by the user and redirected back to the dApp, which then decodes and broadcasts it on the blockchain.

---

### Example: Creating a Transaction with `koilib`

To authorize a transaction, first create an unsigned transaction with `koilib`.

1. Install `koilib` if not already installed:

   ```bash
   npm install koilib
   ```

2. Create an unsigned transaction:

```typescript
import { Provider, Transaction, OperationJson, Contract } from "koilib";
import { Authorizer, Account } from "@sovrano-io/auth-sdk";

const provider = new Provider("https://api.koinos.io");

const account = new Account({
    address: 'my-user-address',
    provider,
})

const transaction = new Transaction({ provider });

// Step 1: Prepare the allowance operation
const { operation } = await koin.transfer({
    from: account.address,
    to: "172AB1FgCsYrRAW5cwQ8KjadgxofvgPFd6",
    value: "1012345678", // 10.12345678 KOIN
});

const allow_operation = await account.allow({ operation });
transaction.pushOperation(allow_operation);

// Step 2: Prepare the execution operation
const exec_operation = await account.execute({ operation });
transaction.pushOperation(exec_operation);

await transaction.prepare();

// Request Authorization with the unsigned transaction:
const authorizeUrl = Authorizer.getRequestUrl({
    transactionJson: transaction.transaction,
    redirectUrl: "https://example.com/callback",
    address: "user-address",
});

// Redirect the user to `authorizeUrl` to authorize the transaction
window.location.href = authorizeUrl;
```

#### Handling Authorizer Response

After signing, Sovrano redirects the user with the signed transaction in the response.

```typescript
import { Authorizer } from "@sovrano-io/auth-sdk";

const responseUrl = "https://example.com/callback?data=encodedResponseData";
const authorizeResponse = Authorizer.getResponse(responseUrl);

if (authorizeResponse.type === "success") {
    console.log("Transaction authorized:", authorizeResponse.transactionJson);

    // Send the signed transaction to the blockchain using `koilib`
    const signedTransaction = new Transaction({
        provider,
        transactionJson: authorizeResponse.transactionJson,
    });

    signedTransaction.send()
        .then(receipt => console.log("Transaction successfully sent:", receipt))
        .catch(error => console.error("Error sending transaction:", error));
} else {
    console.error("Authorization Error:", authorizeResponse.errorMessage);
    console.error("Error Code:", authorizeResponse.errorCode);
}
```
