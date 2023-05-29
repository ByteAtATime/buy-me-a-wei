import Link from "next/link";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Dashboard: NextPage = () => {
  const { address } = useAccount();

  const { data: profile } = useScaffoldContractRead({
    contractName: "BuyMeAWei",
    functionName: "profiles",
    args: [address],
  });

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "BuyMeAWei",
    functionName: "withdrawBalance",
  });

  if (!profile) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile.handle) {
    return (
      <div className="flex items-center justify-center flex-grow flex-col">
        <h1 className="text-4xl text-gray-900">You don&apos;t have a profile yet!</h1>
        <p>Click the button below to create one.</p>

        <div className="flex items-center justify-center mt-8 gap-x-2">
          <Link className="btn btn-primary" href="/">
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-grow flex-col">
      <h1 className="text-4xl text-gray-900">
        Hi, <span className="font-bold">{profile.name}</span>!
      </h1>
      <p className="text-xl font-mono">@{profile.handle}</p>

      <div className="flex items-center justify-center mt-8 gap-x-2">
        <p className="text-2xl text-gray-900">Pending Balance:</p>
        <p className="text-2xl text-gray-900 font-bold">{ethers.utils.formatEther(profile.pendingBalance)} ETH</p>
      </div>

      <div className="flex items-center justify-center mt-8 gap-x-2">
        <button className="btn btn-primary" onClick={writeAsync}>
          Claim
        </button>
      </div>

      <div className="flex items-center justify-center mt-8 gap-x-2">
        <p className="text-2xl text-gray-900">In total, you have received </p>
        <p className="text-2xl text-gray-900 font-bold">{ethers.utils.formatEther(profile.totalDonations)} ETH</p>
      </div>
    </div>
  );
};

export default Dashboard;
