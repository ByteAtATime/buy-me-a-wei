import { useRouter } from "next/router";
import { NextPage } from "next";

const Donate: NextPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center flex-grow flex-col">
      <h1 className="text-4xl">Donate</h1>
      <form
        className="flex items-center justify-center mt-8 gap-x-2"
        onSubmit={e => {
          e.preventDefault();

          router.push(`/${(e.currentTarget.elements[0] as HTMLInputElement).value}`);
        }}
      >
        <input className="input input-primary" type="text" placeholder="Handle" />

        <button className="btn btn-primary" type="submit">
          Go!
        </button>
      </form>
    </div>
  );
};

export default Donate;
