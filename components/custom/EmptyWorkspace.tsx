import Image from "next/image";
import { Button } from "../ui/button";
import { Link } from "lucide-react";

function EmptyWorkspace() {
  return (
    <div className="flex flex-col mt-10 items-center justify-center">
      <Image src={"/folder.png"} alt="folder" width={70} height={70} />
      <h2 className="font-medium text-2xl">No Repository Connected</h2>
      <p className="text-gray-500 text-center mx-2">
        Connect your GitHub repository and add a repository to generate and run
        tests cases
      </p>
      <Button className="mt-5 cursor-pointer">
        <Link className="h-2 w-4 mr-2" /> Connect Repository
      </Button>
    </div>
  );
}

export default EmptyWorkspace;
