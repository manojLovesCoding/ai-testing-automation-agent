"use client";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import EmptyWorkspace from "./EmptyWorkspace";
import { useRouter } from "next/navigation";
import axios from "axios";

function WorkspaceBody() {
  const { userDetails } = useContext(UserDetailsContext);
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    GetGithubUserToken();
  }, []);

  const GetGithubUserToken = async () => {
    const result = await axios.get("/api/github/token");
    console.log("Github User Token: ", result.data.token);
    setToken(result.data.token);
  };

  const OnAddRepo = async () => {
    router.push("/api/github");
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Workspace</h2>
        <h2 className="text-blue-800 bg-blue-100 px-2 py-2 rounded">
          Remaining Credits : {userDetails?.credits}
        </h2>
      </div>

      <Card
        className={
          "mt-5 flex justify-between items-center p-4 border rounded-lg"
        }
      >
        <div className="flex items-center gap-5">
          <Image src={"/github.png"} alt="github" width={40} height={40} />
          <h2 className="text-lg">Connect GitHub & Add Repository</h2>
        </div>

        <div>
          {!token ? (
            <Button onClick={OnAddRepo}>Setup</Button>
          ) : (
            <Button onClick={OnAddRepo}>+ Add Repository</Button>
          )}
        </div>
      </Card>

      <Card>
        <CardContent>
          <EmptyWorkspace />
        </CardContent>
      </Card>
    </div>
  );
}

export default WorkspaceBody;
