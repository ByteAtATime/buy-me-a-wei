import { useState } from "react";
import { useRouter } from "next/router";
import { BigNumber } from "ethers";
import { NextPage } from "next";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const DonationPage: NextPage = () => {
  const router = useRouter();
  const { handle } = router.query;

  const { data: address } = useScaffoldContractRead({
    contractName: "BuyMeAWei",
    functionName: "handleToAddress",
    args: [handle as string],
  });

  const { data: profile } = useScaffoldContractRead({
    contractName: "BuyMeAWei",
    functionName: "profiles",
    args: [address],
  }) as { data: { handle?: string; name?: string; description?: string; pendingBalance?: BigNumber } };

  const [amount, setAmount] = useState(0);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "BuyMeAWei",
    functionName: "donate",
    args: [address],
    value: (amount / 1000).toString(),
  });

  if (!address) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (parseInt(address, 16) === 0 || !profile) {
    return (
      <div className="flex items-center justify-center flex-grow flex-col">
        <h1 className="text-4xl text-gray-900">
          A user with handle <span className="font-bold font-mono">{handle}</span> doesn&apos;t exist!
        </h1>
        <p>Check for spelling and capitalization.</p>

        <form
          className="flex items-center justify-center mt-8 gap-x-2"
          onSubmit={e => {
            e.preventDefault();
            const handle = (e.currentTarget.elements[0] as HTMLInputElement).value;
            router.push(`/${handle}`);
          }}
        >
          <input className="input input-primary" type="text" placeholder="Handle" />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await writeAsync();
  };

  return (
    <div className="flex items-center justify-center flex-grow flex-col">
      <h1 className="text-4xl text-gray-900">
        Send a donation to <span className="font-bold font-mono">{profile.name}</span>!
      </h1>
      <p>
        Address: <span className="font-bold font-mono">{address}</span>
      </p>

      <p className="text-gray-800 mt-4 text-xl">{profile.description}</p>

      <form className="flex items-center justify-center mt-8 gap-y-2 flex-col" onSubmit={submit}>
        <p>
          <input
            className="input input-primary"
            type="number"
            placeholder="Amount"
            onChange={e => setAmount(Number(e.target.value))}
          />{" "}
          milliEther
        </p>
        <p>(= {amount / 1000} Ether)</p>
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default DonationPage;
