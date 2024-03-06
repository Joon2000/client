import { useState, useEffect } from "react";
import abi from "./contractJson/ERC.json";
import { ethers } from "ethers";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("Not connected");
  const [tokenId, setTokenId] = useState("");
  const [to, setTo] = useState("");
  const [stampNumber, setStampNumber] = useState("");

  useEffect(() => {
    const template = async () => {
      const contractAddres = "0xd259f446F232Ef9C28E087866402feF25D2Ad345";
      const contractABI = abi.abi;

      //Metamask part
      //1. In order do transactions on goerli testnet
      //2. Metmask consists of infura api which actually help in connectig to the blockhain
      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum); //read the Blockchain
        const signer = provider.getSigner(); //write the blockchain

        const contract = new ethers.Contract(
          contractAddres,
          contractABI,
          signer
        );
        console.log(contract);
        setState({ provider, signer, contract });
      } catch (error) {
        console.log(error);
      }
    };
    template();
  }, []);

  const handleMintCoupon = async (e) => {
    e.preventDefault();
    alert("Mint");
    const tx = await state.contract.mintCoupon(to);
    await tx.wait();
    alert("Coupon Minted");
  };

  const handleAddStamp = async (e) => {
    e.preventDefault();
    alert("Add stamp");
    const tx = await state.contract.addStampToCoupon(tokenId);
    await tx.wait();
    alert("Transaction is successul");
  };

  const handleGetStampNumber = async (e) => {
    e.preventDefault();
    const number = await state.contract.getCurrentStampNumber(tokenId);
    setStampNumber(number);
  };

  return (
    <div>
      <p style={{ marginTop: "10px", marginLeft: "5px" }}>
        <small>Connected Account - {account}</small>
      </p>
      <div>
        <form onSubmit={handleMintCoupon}>
          <label>
            address
            <input
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
              }}
            />
          </label>
          <button type="submit">MintToken</button>
        </form>
        <form onSubmit={handleAddStamp}>
          <label>
            tokenId
            <input
              type="number"
              value={tokenId}
              onChange={(e) => {
                setTokenId(e.target.value);
              }}
            />
          </label>
          <button type="submit">AddStamp</button>
        </form>
        <form onSubmit={handleGetStampNumber}>
          <label>
            tokenId
            <input
              type="number"
              value={tokenId}
              onChange={(e) => {
                setTokenId(e.target.value);
              }}
            />
          </label>
          <button type="submit">Stamp Number</button>
        </form>
        Stamp Number: {stampNumber}
      </div>
    </div>
  );
}

export default App;
