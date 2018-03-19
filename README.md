# Stellar POC for Labs


## Flow

1. Payer client send a payment request to Merchant server
2. Merchant server validate the transaction (address, amount, expiry date) 
3. If transaction is valid, Merchant generate an RSA signature for the payer request.
4. Payer recieve merchant approval (RCA signature) and create a CRC-32 hash.
5. Payer submit a payment transaction to Stellar blockchain following the approved request.
6. Merchant server that is listening for incoming requests recieve the transaction and validate its CRC-32 hash.


## Projects:
1. **Payer client** - nodejs app.  send a json payment request for merchant and emits an asset transfer trasaction to Stellar public ledger.
2. **Merchant server** - nodejs webserver. Recieve requests from Payer clients,Listen to incoming Stellar transactions and validate.


## Usage

On ubuntu machine -> git clone

### Start Merchant server

1. npm install
2. node app.js

### Start payer client

1. npm install
2. node app.js


### First time 
When executing merchant or payer apps , new accounts will be created and funded with 100 XMR on Stellar testnet.
public and private key files will be automatic generated 
1. ./public.key
2. ./secret.key

