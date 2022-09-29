import "./App.css";
import { ethers } from "ethers";
import uChild from "./abi/UChildERC20.json";
import { Biconomy } from "@biconomy/mexa";
import { useState } from "react";


function App() {
  const [holder, setHolder] = useState();
  const [spender, setSpender] = useState();
  const [nonce, setNonce] = useState();
  const [expiry, setExpiry] = useState();
  const [allowed, setAllowed] = useState();
  const [signature, setSignature] = useState();

  const contractAddress = "0x6dAcd8a6271Bb9aca488413c2CeB0708121072E6";

  const requestAccounts = async () => {
    return await window.ethereum.request({ method: "eth_requestAccounts" });
  };
 
  const permit = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await requestAccounts();

      const biconomy = new Biconomy(window.ethereum, {
        apiKey: process.env.REACT_APP_BICONOMY_API_KEY,
        debug: true,
        contractAddresses: [contractAddress],
      });
      const provider = await biconomy.provider;

      const contractInstance = new ethers.Contract(
        contractAddress,
        uChild.abi,
        biconomy.ethersProvider
      );
      await biconomy.init();

      const { data } = await contractInstance.populateTransaction.permit(
        holder,
        spender,
        nonce,
        expiry,
        allowed,
        signature
      );

      let txParams = {
        data: data,
        to: contractAddress,
        from: accounts[0],
        signatureType: "EIP712_SIGN",
      };

      await provider.send("eth_sendTransaction", [txParams]);
    }
  };

  return (
    <div className="App">
      <input
        placeholder="Holder"
        value={holder}
        onChange={(e) => setHolder(e.target.value)}
      />
      <input
        placeholder="Spender"
        value={spender}
        onChange={(e) => setSpender(e.target.value)}
      />
      <input
        placeholder="Nonce"
        value={nonce}
        onChange={(e) => setNonce(e.target.value)}
      />
      <input
        placeholder="Expiry"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      />
      <input
        placeholder="Allowed"
        value={allowed}
        onChange={(e) => setAllowed(e.target.value)}
      />
      <input
        placeholder="Signature"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />
      <button onClick={permit}>Permit</button>
    </div>
  );
}

export default App;
