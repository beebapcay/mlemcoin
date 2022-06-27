```
    models
      - block: block(from) and blockUtil(calHash, timestamp, generis)
      
      - blockchain: blockchain(latest, createBlockFromTransaction, 
      createNextBlock, createBlockFromTransaction) and blockchainUtil(
      calculateAccumulatedDifficulty, calculateDifficulty, calculateDifficulty, 
      calculateAdjustedDifficulty)
      
      - miner: miner(mine)
      
      - transaction: transaction and transactionUtil(getTransactionId, 
      createCoinbaseTransaction, processTransaction)
      
      - transactionPool: transactionPool and transactionPoolUtil(getTxIns)
      
      - txIn: txIn and txInUtil(signTxIn, getTxInAmount)
      
      - txOut: txOut and ITxOutForAmount
      
      - unspentTxOut: unspentTxOut and unspentTxOutUtil(exists, getUnspentTxOuts, hasTxIn, update, toUnsignedTxIn)
      
      - wallet: wallet and walletUtil(getPublicKey, generatePrivateKey, 
      findTxOutsForTransactionAmount, createTxOuts, filterTxPoolTxs, 
      createTransaction)
      
      
      


```