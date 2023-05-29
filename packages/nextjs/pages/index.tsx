import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [handle, setHandle] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "BuyMeAWei",
    functionName: "createProfile",
    args: [username, description, handle],
  });

  const router = useRouter();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await writeAsync();

    router.push(`/${handle}`);
  };

  return (
    <>
      <Head>
        <title>Buy Me A Wei</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="flex items-center justify-center flex-grow flex-col">
        <h1 className="text-4xl text-gray-900">Buy Me A Wei</h1>

        <form className="flex items-center justify-center mt-8 flex-col gap-y-2" onSubmit={submit}>
          <input
            className="input input-primary"
            type="text"
            placeholder="Handle"
            onChange={e => setHandle(e.target.value)}
          />
          <input
            className="input input-primary"
            type="text"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
          />
          <textarea
            className="textarea textarea-primary"
            rows={4}
            cols={40}
            placeholder="Description"
            onChange={e => setDescription(e.target.value)}
          />

          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Home;
