import { SignIn } from "@clerk/nextjs";

interface SearchParams {
  redirectUrl?: string;
}

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { redirectUrl } = searchParams;

  return (
    <div
      className={"w-full min-h-screen mx-auto flex justify-center items-center"}
    >
      <SignIn redirectUrl={redirectUrl || "/"} />
    </div>
  );
};

export default Page;
